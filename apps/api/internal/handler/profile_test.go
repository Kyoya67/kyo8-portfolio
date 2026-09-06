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

type profileServiceFake struct{ err error }

type failingResponseWriter struct {
	*httptest.ResponseRecorder
}

func (w failingResponseWriter) Write([]byte) (int, error) {
	return 0, errors.New("response write failed")
}

func (f profileServiceFake) GetProfile(context.Context) (model.Profile, error) {
	return model.Profile{Name: "Kyoya"}, f.err
}
func (f profileServiceFake) UpdateProfile(context.Context, model.Profile) error { return f.err }

/*
 ******************************************************************************
 * GetProfile
 * - 正常にプロフィールを取得した場合に、JSONを返し、200を返すこと
 * - レスポンスのJSONエンコードに失敗した場合に、ResponseEncodeFailed / 500を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestProfileHandlerGetProfile(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProfileHandler(profileServiceFake{})
		req := httptest.NewRequest(http.MethodGet, "/profile", nil)
		h.GetProfile(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
		}
	})

	t.Run("response encode error", func(t *testing.T) {
		w := failingResponseWriter{httptest.NewRecorder()}
		h := NewProfileHandler(profileServiceFake{})
		req := httptest.NewRequest(http.MethodGet, "/profile", nil)
		h.GetProfile(w, req)
		if w.Code != http.StatusInternalServerError {
			t.Errorf("status = %d, want %d", w.Code, http.StatusInternalServerError)
		}
	})

	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProfileHandler(profileServiceFake{err: sharedDependencyError()})
		req := httptest.NewRequest(http.MethodGet, "/profile", nil)
		h.GetProfile(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * UpdateProfile
 * - 正常なJSONを受け取った場合に、プロフィールを更新し、204を返すこと
 * - JSON形式が不正な場合に、ReqBodyDecodeFailed / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestProfileHandlerUpdateProfile(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProfileHandler(profileServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/profile", strings.NewReader(`{"name":"Kyoya"}`))
		h.UpdateProfile(w, req)
		if w.Code != http.StatusNoContent {
			t.Errorf("status = %d, want %d", w.Code, http.StatusNoContent)
		}
	})

	t.Run("invalid body", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProfileHandler(profileServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/profile", strings.NewReader("invalid"))
		h.UpdateProfile(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.ReqBodyDecodeFailed, "Failed to decode request body")
	})

	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewProfileHandler(profileServiceFake{err: sharedDependencyError()})
		req := httptest.NewRequest(http.MethodPost, "/admin/profile", strings.NewReader(`{"name":"Kyoya"}`))
		h.UpdateProfile(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}
