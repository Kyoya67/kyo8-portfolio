package apperrors

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/logging"
)

// エラーが発生したときのレスポンス処理をここで一括で行う
func ErrorHandler(w http.ResponseWriter, req *http.Request, err error) {
	var appErr *Error
	if !errors.As(err, &appErr) {
		appErr = &Error{
			ErrCode: string(Unknown),
			Message: "internal process failed",
			Err:     err,
		}
	}

	var statusCode int

	switch ErrCode(appErr.ErrCode) {
	case ReqBodyDecodeFailed, BadParam, RequestBodyTooLarge:
		statusCode = http.StatusBadRequest
	case NotFound:
		statusCode = http.StatusNotFound
	case DependencyThrottled, DependencyUnavailable:
		statusCode = http.StatusServiceUnavailable
	case DependencyAuthFailed, DependencyConfigError:
		statusCode = http.StatusInternalServerError
	case ExternalServiceFailed:
		statusCode = http.StatusBadGateway
	case Timeout:
		statusCode = http.StatusGatewayTimeout
	default:
		statusCode = http.StatusInternalServerError
	}

	cause := "<nil>"
	if appErr.Err != nil {
		cause = appErr.Err.Error()
	}
	logging.Default.Error(
		"error occurred",
		"error code", appErr.ErrCode,
		"method", req.Method,
		"path", req.URL.Path,
		"status", statusCode,
		"message", appErr.Message,
		"cause", cause,
	)

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(appErr)
}
