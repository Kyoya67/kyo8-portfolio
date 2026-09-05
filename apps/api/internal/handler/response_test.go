package handler

import (
	"encoding/json"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"net/http"
	"net/http/httptest"
	"testing"
)

/*
 ******************************************************************************
 * writeJSON
 * - JSONエンコードに失敗した場合、ResponseEncodeFailed / 500を返すこと
 ******************************************************************************
 */
func TestWriteJSONEncodeError(t *testing.T) {
	r := httptest.NewRecorder()
	writeJSON(r, httptest.NewRequest(http.MethodGet, "/test", nil), func() {})
	var response apperrors.Error
	if err := json.Unmarshal(r.Body.Bytes(), &response); err != nil {
		t.Fatal(err)
	}
	if r.Code != http.StatusInternalServerError || response.ErrCode != string(apperrors.ResponseEncodeFailed) {
		t.Errorf("status=%d response=%+v", r.Code, response)
	}
}

/*
 ******************************************************************************
 * writeJSON
 * - JSON書き込みに失敗した場合に、エラーをログへ記録して処理を終了すること
 ******************************************************************************
 */
func TestWriteJSONWriteError(t *testing.T) {
	w := failingResponseWriter{httptest.NewRecorder()}
	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	writeJSON(w, req, map[string]string{"message": "ok"})
	if w.Code != http.StatusOK {
		t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
	}
}
