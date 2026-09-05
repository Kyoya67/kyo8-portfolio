package handler

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
)

type decodeTestPayload struct {
	Name string `json:"name"`
}

/*
 ******************************************************************************
 * decodeJSONBody
 * - 正常なJSONを受け取った場合に、正常にデコードし、エラーを返さないこと
 * - 空ボディや不正JSONを受け取った場合に、ReqBodyDecodeFailed / 400を返すこと
 * - 未知フィールド、複数JSON、余計なデータを受け取った場合に、ReqBodyDecodeFailed / 400を返すこと
 * - ボディサイズが上限を超えた場合に、RequestBodyTooLarge / 400を返すこと
 ******************************************************************************
 */
func TestDecodeJSONBody(t *testing.T) {
	largeValue := strings.Repeat("a", maxRequestBodyBytes)

	tests := []struct {
		name        string
		body        string
		wantCode    apperrors.ErrCode
		wantMessage string
		wantName    string
	}{
		{
			name:     "valid JSON",
			body:     `{"name":"Kyoya"}`,
			wantName: "Kyoya",
		},
		{
			name:        "empty body",
			body:        "",
			wantCode:    apperrors.ReqBodyDecodeFailed,
			wantMessage: "Failed to decode request body",
		},
		{
			name:        "invalid JSON",
			body:        `{"name":}`,
			wantCode:    apperrors.ReqBodyDecodeFailed,
			wantMessage: "Failed to decode request body",
		},
		{
			name:        "unknown field",
			body:        `{"unknown":"value"}`,
			wantCode:    apperrors.ReqBodyDecodeFailed,
			wantMessage: "Failed to decode request body",
		},
		{
			name:        "multiple JSON values",
			body:        `{"name":"first"}{"name":"second"}`,
			wantCode:    apperrors.ReqBodyDecodeFailed,
			wantMessage: "request body must contain one JSON value",
		},
		{
			name:        "invalid trailing data",
			body:        `{"name":"Kyoya"}invalid`,
			wantCode:    apperrors.ReqBodyDecodeFailed,
			wantMessage: "request body contains invalid trailing data",
		},
		{
			name:        "body too large",
			body:        `{"name":"` + largeValue + `"}`,
			wantCode:    apperrors.RequestBodyTooLarge,
			wantMessage: "request body is too large",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			req := httptest.NewRequest(http.MethodPost, "/admin/profile", strings.NewReader(tt.body))
			var payload decodeTestPayload

			err := decodeJSONBody(w, req, &payload)
			if tt.wantCode == "" {
				if err != nil {
					t.Fatalf("decodeJSONBody() error = %v", err)
				}
				if payload.Name != tt.wantName {
					t.Errorf("Name = %q, want %q", payload.Name, tt.wantName)
				}
				return
			}

			if err == nil {
				t.Fatal("decodeJSONBody() error = nil, want error")
			}
			var appErr *apperrors.Error
			if !errors.As(err, &appErr) {
				t.Fatalf("error type = %T, want *apperrors.Error", err)
			}
			if appErr.ErrCode != string(tt.wantCode) {
				t.Errorf("ErrCode = %q, want %q", appErr.ErrCode, tt.wantCode)
			}
			if appErr.Message != tt.wantMessage {
				t.Errorf("Message = %q, want %q", appErr.Message, tt.wantMessage)
			}
		})
	}
}
