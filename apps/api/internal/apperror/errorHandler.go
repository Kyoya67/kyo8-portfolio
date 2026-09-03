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
			Code:    string(Unknown),
			Message: "internal process failed",
			Err:     err,
		}
	}

	log.Printf("error: %s\n", appErr)

	var statusCode int

	switch ErrCode(appErr.Code) {
	case NAData:
		statusCode = http.StatusNotFound
	case NoTargetData, ReqBodyDecodeFailed, BadParam:
		statusCode = http.StatusBadRequest
	case RequiredAuthorizationHeader, CannotMakeValidator, Unauthorizated:
		statusCode = http.StatusUnauthorized
	case NotMatchUser:
		statusCode = http.StatusForbidden
	default:
		statusCode = http.StatusInternalServerError
	}

	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(appErr)
}
