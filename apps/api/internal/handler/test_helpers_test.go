package handler

import (
	"encoding/json"
	"errors"
	"net/http/httptest"
	"testing"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
)

/*
 ******************************************************************************
 * Test Helpers
 * - sharedDependencyError: Serviceエラーを再現するためのエラーを作成すること
 * - assertSharedError: HTTPステータス、エラーコード、メッセージを検証すること
 ******************************************************************************
 */
func sharedDependencyError() error {
	return apperrors.DependencyUnavailable.Wrap(errors.New("dependency down"), "temporarily unavailable")
}

func assertSharedError(t *testing.T, w *httptest.ResponseRecorder, status int, code apperrors.ErrCode, message string) {
	t.Helper()
	if w.Code != status {
		t.Errorf("status = %d, want %d", w.Code, status)
	}
	var response apperrors.Error
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Fatalf("response is not valid JSON: %v", err)
	}
	if response.ErrCode != string(code) || response.Message != message {
		t.Errorf("response = %+v", response)
	}
}
