package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
)

func writeJSON(w http.ResponseWriter, r *http.Request, value any) {
	body, err := json.Marshal(value)
	if err != nil {
		err = apperrors.ResponseEncodeFailed.Wrap(err, "Failed to encode response body")
		apperrors.ErrorHandler(w, r, err)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(body)
}
