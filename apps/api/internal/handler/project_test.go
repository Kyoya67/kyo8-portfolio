package handler

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/gorilla/mux"
)

type projectServiceFake struct{ err error }

func (f projectServiceFake) ListProjects(context.Context) ([]model.Project, error) {
	return []model.Project{{Slug: "test"}}, f.err
}
func (f projectServiceFake) GetProject(context.Context, string) (model.Project, error) {
	return model.Project{Slug: "test"}, f.err
}
func (f projectServiceFake) SaveProject(context.Context, model.Project) error { return f.err }
func (f projectServiceFake) DeleteProject(context.Context, string) error      { return f.err }

/*
 ******************************************************************************
 * ListProjects
 * - 正常に一覧を取得した場合に、JSONを返し、200を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestProjectHandlerListProjects(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{})
		req := httptest.NewRequest(http.MethodGet, "/projects", nil)
		h.ListProjects(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
		}
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{err: sharedDependencyError()})
		req := httptest.NewRequest(http.MethodGet, "/projects", nil)
		h.ListProjects(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * GetProject
 * - URLパラメータのidが指定された場合に、プロジェクトを取得し、200を返すこと
 * - URLパラメータのidが空の場合に、BadParam / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestProjectHandlerGetProject(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{})
		h.GetProject(w, projectRequest(http.MethodGet, "/projects/p1", "p1", nil))
		if w.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
		}
	})
	t.Run("missing id", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{})
		h.GetProject(w, projectRequest(http.MethodGet, "/projects/", "", nil))
		assertSharedError(t, w, http.StatusBadRequest, apperrors.BadParam, "project id is required")
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{err: sharedDependencyError()})
		h.GetProject(w, projectRequest(http.MethodGet, "/projects/p1", "p1", nil))
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * CreateProject
 * - 正常なJSONを受け取った場合に、プロジェクトを保存し、204を返すこと
 * - JSON形式が不正な場合に、ReqBodyDecodeFailed / 400を返すこと
 * - リクエストボディのidがない場合に、BadParam / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestProjectHandlerCreateProject(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/projects", strings.NewReader(`{"id":"p1"}`))
		h.CreateProject(w, req)
		if w.Code != http.StatusNoContent {
			t.Errorf("status = %d, want %d", w.Code, http.StatusNoContent)
		}
	})
	t.Run("invalid body", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/projects", strings.NewReader("invalid"))
		h.CreateProject(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.ReqBodyDecodeFailed, "Failed to decode request body")
	})
	t.Run("missing id", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/projects", strings.NewReader(`{"slug":"test"}`))
		h.CreateProject(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.BadParam, "project id is required")
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{err: sharedDependencyError()})
		req := httptest.NewRequest(http.MethodPost, "/admin/projects", strings.NewReader(`{"id":"p1"}`))
		h.CreateProject(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * UpdateProject
 * - 正常なJSONを受け取った場合に、URLのidを設定して保存し、204を返すこと
 * - JSON形式が不正な場合に、ReqBodyDecodeFailed / 400を返すこと
 * - URLパラメータのidが空の場合に、BadParam / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestProjectHandlerUpdateProject(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{})
		h.UpdateProject(w, projectRequest(http.MethodPut, "/admin/projects/p1", "p1", strings.NewReader(`{"title":{}}`)))
		if w.Code != http.StatusNoContent {
			t.Errorf("status = %d, want %d", w.Code, http.StatusNoContent)
		}
	})
	t.Run("invalid body", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{})
		h.UpdateProject(w, projectRequest(http.MethodPut, "/admin/projects/p1", "p1", strings.NewReader("invalid")))
		assertSharedError(t, w, http.StatusBadRequest, apperrors.ReqBodyDecodeFailed, "Failed to decode request body")
	})
	t.Run("missing id", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{})
		h.UpdateProject(w, projectRequest(http.MethodPut, "/admin/projects/", "", strings.NewReader(`{"title":{}}`)))
		assertSharedError(t, w, http.StatusBadRequest, apperrors.BadParam, "project id is required")
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{err: sharedDependencyError()})
		h.UpdateProject(w, projectRequest(http.MethodPut, "/admin/projects/p1", "p1", strings.NewReader(`{"title":{}}`)))
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * DeleteProject
 * - 正常なidが指定された場合に、プロジェクトを削除し、204を返すこと
 * - idが空の場合に、BadParam / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestProjectHandlerDeleteProject(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{})
		h.DeleteProject(w, projectRequest(http.MethodDelete, "/admin/projects/p1", "p1", nil))
		if w.Code != http.StatusNoContent {
			t.Errorf("status = %d, want %d", w.Code, http.StatusNoContent)
		}
	})
	t.Run("missing id", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{})
		h.DeleteProject(w, projectRequest(http.MethodDelete, "/admin/projects/", "", nil))
		assertSharedError(t, w, http.StatusBadRequest, apperrors.BadParam, "project id is required")
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProjectHandler(projectServiceFake{err: sharedDependencyError()})
		h.DeleteProject(w, projectRequest(http.MethodDelete, "/admin/projects/p1", "p1", nil))
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

func projectRequest(method, target, id string, body io.Reader) *http.Request {
	return mux.SetURLVars(httptest.NewRequest(method, target, body), map[string]string{"id": id})
}
