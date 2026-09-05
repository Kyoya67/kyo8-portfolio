package handler

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

/*
 ******************************************************************************
 * Health
 * - GET /healthを受け取った場合に、OKと200を返すこと
 * - GET以外のメソッドを受け取った場合に、405を返すこと
 ******************************************************************************
 */
func TestHealth(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/health", nil)
		Health(w, req)
		if w.Code != http.StatusOK || strings.TrimSpace(w.Body.String()) != "OK" {
			t.Errorf("response = %d %q", w.Code, w.Body.String())
		}
		if w.Header().Get("Content-Type") != "text/plain; charset=utf-8" {
			t.Errorf("Content-Type = %q", w.Header().Get("Content-Type"))
		}
	})
	t.Run("method not allowed", func(t *testing.T) {
		w := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPost, "/health", nil)
		Health(w, req)
		if w.Code != http.StatusMethodNotAllowed {
			t.Errorf("status = %d, want %d", w.Code, http.StatusMethodNotAllowed)
		}
	})
}
