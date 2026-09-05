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

type careerServiceFake struct{ err error }

func (f careerServiceFake) ListCareers(context.Context) ([]model.Career, error) {
	return []model.Career{{Organization: "Example"}}, f.err
}
func (f careerServiceFake) SaveCareer(context.Context, model.Career) error { return f.err }
func (f careerServiceFake) DeleteCareer(context.Context, string) error     { return f.err }

/*
 ******************************************************************************
 * ListCareers
 * - 正常に経歴一覧を取得した場合に、JSONを返し、200を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestCareerHandlerListCareers(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{})
		req := httptest.NewRequest(http.MethodGet, "/careers", nil)
		h.ListCareers(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
		}
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{err: sharedDependencyError()})
		req := httptest.NewRequest(http.MethodGet, "/careers", nil)
		h.ListCareers(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * CreateCareer
 * - 正常なJSONを受け取った場合に、経歴を保存し、204を返すこと
 * - JSON形式が不正な場合に、ReqBodyDecodeFailed / 400を返すこと
 * - リクエストボディのidがない場合に、BadParam / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestCareerHandlerCreateCareer(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/careers", strings.NewReader(`{"id":"c1"}`))
		h.CreateCareer(w, req)
		if w.Code != http.StatusNoContent {
			t.Errorf("status = %d, want %d", w.Code, http.StatusNoContent)
		}
	})
	t.Run("invalid body", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/careers", strings.NewReader("invalid"))
		h.CreateCareer(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.ReqBodyDecodeFailed, "Failed to decode request body")
	})
	t.Run("missing id", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/careers", strings.NewReader(`{"organization":"Example"}`))
		h.CreateCareer(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.BadParam, "career id is required")
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{err: sharedDependencyError()})
		req := httptest.NewRequest(http.MethodPost, "/admin/careers", strings.NewReader(`{"id":"c1"}`))
		h.CreateCareer(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * UpdateCareer
 * - 正常なJSONとidを受け取った場合に、経歴を保存し、204を返すこと
 * - JSON形式が不正な場合に、ReqBodyDecodeFailed / 400を返すこと
 * - URLパラメータのidが空の場合に、BadParam / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestCareerHandlerUpdateCareer(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{})
		h.UpdateCareer(w, careerRequest(http.MethodPut, "/admin/careers/c1", "c1", strings.NewReader(`{"organization":"Updated"}`)))
		if w.Code != http.StatusNoContent {
			t.Errorf("status = %d, want %d", w.Code, http.StatusNoContent)
		}
	})
	t.Run("invalid body", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{})
		h.UpdateCareer(w, careerRequest(http.MethodPut, "/admin/careers/c1", "c1", strings.NewReader("invalid")))
		assertSharedError(t, w, http.StatusBadRequest, apperrors.ReqBodyDecodeFailed, "Failed to decode request body")
	})
	t.Run("missing id", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{})
		h.UpdateCareer(w, careerRequest(http.MethodPut, "/admin/careers/", "", strings.NewReader(`{"organization":"Example"}`)))
		assertSharedError(t, w, http.StatusBadRequest, apperrors.BadParam, "career id is required")
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{err: sharedDependencyError()})
		h.UpdateCareer(w, careerRequest(http.MethodPut, "/admin/careers/c1", "c1", strings.NewReader(`{"organization":"Example"}`)))
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * DeleteCareer
 * - 正常なidが指定された場合に、経歴を削除し、204を返すこと
 * - idが空の場合に、BadParam / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestCareerHandlerDeleteCareer(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{})
		h.DeleteCareer(w, careerRequest(http.MethodDelete, "/admin/careers/c1", "c1", nil))
		if w.Code != http.StatusNoContent {
			t.Errorf("status = %d, want %d", w.Code, http.StatusNoContent)
		}
	})
	t.Run("missing id", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{})
		h.DeleteCareer(w, careerRequest(http.MethodDelete, "/admin/careers/", "", nil))
		assertSharedError(t, w, http.StatusBadRequest, apperrors.BadParam, "career id is required")
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewCareerHandler(careerServiceFake{err: sharedDependencyError()})
		h.DeleteCareer(w, careerRequest(http.MethodDelete, "/admin/careers/c1", "c1", nil))
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

func careerRequest(method, target, id string, body io.Reader) *http.Request {
	return mux.SetURLVars(httptest.NewRequest(method, target, body), map[string]string{"id": id})
}
