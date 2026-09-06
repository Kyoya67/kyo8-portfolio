package handler

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
)

type skillServiceFake struct{ err error }

func (f skillServiceFake) GetSkills(context.Context) ([]model.Skill, error) {
	return []model.Skill{{Name: "Go"}}, f.err
}
func (f skillServiceFake) UpdateSkills(context.Context, []model.Skill) error { return f.err }

type skillFailingResponseWriter struct{ *httptest.ResponseRecorder }

func (skillFailingResponseWriter) Write([]byte) (int, error) {
	return 0, errors.New("response write failed")
}

/*
 ******************************************************************************
 * GetSkills
 * - 正常にスキル一覧を取得した場合に、JSONを返し、200を返すこと
 * - レスポンスのJSONエンコードに失敗した場合に、ResponseEncodeFailed / 500を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestSkillHandlerGetSkills(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewSkillHandler(skillServiceFake{})
		req := httptest.NewRequest(http.MethodGet, "/skills", nil)
		h.GetSkills(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
		}
	})

	t.Run("response encode error", func(t *testing.T) {
		w := skillFailingResponseWriter{httptest.NewRecorder()}
		h := NewSkillHandler(skillServiceFake{})
		req := httptest.NewRequest(http.MethodGet, "/skills", nil)
		h.GetSkills(w, req)
		if w.Code != http.StatusInternalServerError {
			t.Errorf("status = %d, want %d", w.Code, http.StatusInternalServerError)
		}
	})

	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewSkillHandler(skillServiceFake{err: sharedDependencyError()})
		req := httptest.NewRequest(http.MethodGet, "/skills", nil)
		h.GetSkills(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * UpdateSkills
 * - 正常なJSONを受け取った場合に、スキル一覧を更新し、204を返すこと
 * - JSON形式が不正な場合に、ReqBodyDecodeFailed / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestSkillHandlerUpdateSkills(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewSkillHandler(skillServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/skills", strings.NewReader(`[{"name":"Go"}]`))
		h.UpdateSkills(w, req)
		if w.Code != http.StatusNoContent {
			t.Errorf("status = %d, want %d", w.Code, http.StatusNoContent)
		}
	})

	t.Run("invalid body", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewSkillHandler(skillServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/skills", strings.NewReader("invalid"))
		h.UpdateSkills(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.ReqBodyDecodeFailed, "Failed to decode request body")
	})

	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewSkillHandler(skillServiceFake{err: sharedDependencyError()})
		req := httptest.NewRequest(http.MethodPost, "/admin/skills", strings.NewReader(`[{"name":"Go"}]`))
		h.UpdateSkills(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}
