package apperrors

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
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

	log.Printf("error: %s\n", appErr)

	var statusCode int

	switch ErrCode(appErr.ErrCode) {
	case ReqBodyDecodeFailed, BadParam:
		statusCode = http.StatusBadRequest
	case NotFound:
		statusCode = http.StatusNotFound
	case DependencyThrottled, DependencyUnavailable:
		statusCode = http.StatusServiceUnavailable
	case DependencyAuthFailed, DependencyConfigError:
		statusCode = http.StatusInternalServerError
	case Timeout:
		statusCode = http.StatusGatewayTimeout
	default:
		statusCode = http.StatusInternalServerError
	}

	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(appErr)
}
