package apperrors

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestErrorWrap(t *testing.T) {
	cause := errors.New("database unavailable")
	err := BadParam.Wrap(cause, "request timed out")

	var appErr *Error
	if !errors.As(err, &appErr) {
		t.Fatal("errors.As() did not find *Error")
	}
	if appErr.ErrCode != string(BadParam) {
		t.Errorf("ErrCode = %q, want %q", appErr.ErrCode, BadParam)
	}
	if appErr.Message != "request timed out" {
		t.Errorf("Message = %q, want %q", appErr.Message, "request timed out")
	}
	if !errors.Is(err, cause) {
		t.Error("errors.Is() did not find the original error")
	}
}

func TestErrorJSONDoesNotExposeCause(t *testing.T) {
	err := &Error{
		ErrCode: string(BadParam),
		Message: "temporarily unavailable",
		Err:     errors.New("internal database details"),
	}

	body, marshalErr := json.Marshal(err)
	if marshalErr != nil {
		t.Fatalf("json.Marshal() error = %v", marshalErr)
	}

	got := string(body)
	if got != `{"errCode":"R001","message":"temporarily unavailable"}` {
		t.Errorf("JSON = %s", got)
	}
	if bytes.Contains(body, []byte("internal database details")) {
		t.Error("original error was exposed in JSON")
	}
}

func TestErrorHandlerStatusAndResponse(t *testing.T) {
	tests := []struct {
		name   string
		code   ErrCode
		status int
	}{
		{name: "bad request", code: BadParam, status: http.StatusBadRequest},
		{name: "request body decode failed", code: ReqBodyDecodeFailed, status: http.StatusBadRequest},
		{name: "response encode failed", code: ResponseEncodeFailed, status: http.StatusInternalServerError},
		{name: "not found", code: NotFound, status: http.StatusNotFound},
		{name: "request body too large", code: RequestBodyTooLarge, status: http.StatusBadRequest},
		{name: "dependency unavailable", code: DependencyUnavailable, status: http.StatusServiceUnavailable},
		{name: "dependency auth failed", code: DependencyAuthFailed, status: http.StatusInternalServerError},
		{name: "dependency config error", code: DependencyConfigError, status: http.StatusInternalServerError},
		{name: "throttled", code: DependencyThrottled, status: http.StatusServiceUnavailable},
		{name: "timeout", code: Timeout, status: http.StatusGatewayTimeout},
		{name: "data mapping failed", code: DataMappingFailed, status: http.StatusInternalServerError},
		{name: "external service", code: ExternalServiceFailed, status: http.StatusBadGateway},
		{name: "unknown", code: Unknown, status: http.StatusInternalServerError},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			req := httptest.NewRequest(http.MethodGet, "/profile", nil)
			ErrorHandler(recorder, req, tt.code.Wrap(errors.New("internal cause"), "client message"))

			if recorder.Code != tt.status {
				t.Errorf("status = %d, want %d", recorder.Code, tt.status)
			}
			if got := recorder.Header().Get("Content-Type"); got != "application/json; charset=utf-8" {
				t.Errorf("Content-Type = %q", got)
			}

			var response Error
			if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
				t.Fatalf("response is not valid JSON: %v", err)
			}
			if response.ErrCode != string(tt.code) || response.Message != "client message" {
				t.Errorf("response = %+v", response)
			}
			if response.Err != nil {
				t.Error("original error was included in response")
			}
		})
	}
}

func TestErrorHandlerConvertsUnknownError(t *testing.T) {
	recorder := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/admin/profile", nil)

	ErrorHandler(recorder, req, errors.New("secret internal error"))

	if recorder.Code != http.StatusInternalServerError {
		t.Errorf("status = %d, want %d", recorder.Code, http.StatusInternalServerError)
	}

	var response Error
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("response is not valid JSON: %v", err)
	}
	if response.ErrCode != string(Unknown) || response.Message != "internal process failed" {
		t.Errorf("response = %+v", response)
	}
}

func TestErrorHandlerWithoutCause(t *testing.T) {
	recorder := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/profile", nil)

	ErrorHandler(recorder, req, NotFound.Wrap(nil, "profile not found"))

	if recorder.Code != http.StatusNotFound {
		t.Errorf("status = %d, want %d", recorder.Code, http.StatusNotFound)
	}

	var response Error
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("response is not valid JSON: %v", err)
	}
	if response.ErrCode != string(NotFound) || response.Message != "profile not found" {
		t.Errorf("response = %+v", response)
	}
}
