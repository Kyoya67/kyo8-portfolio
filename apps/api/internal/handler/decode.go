package handler

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
)

const maxRequestBodyBytes = 1 << 20 // 1 MiB

func decodeJSONBody(w http.ResponseWriter, r *http.Request, dst any) error {
	r.Body = http.MaxBytesReader(w, r.Body, maxRequestBodyBytes)

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(dst); err != nil {
		var tooLarge *http.MaxBytesError
		if errors.As(err, &tooLarge) {
			return apperrors.RequestBodyTooLarge.Wrap(err, "request body is too large")
		}
		return apperrors.ReqBodyDecodeFailed.Wrap(err, "Failed to decode request body")
	}

	// 複数のJSON値が含まれていないか確認する
	var extra any
	if err := decoder.Decode(&extra); !errors.Is(err, io.EOF) {
		if err == nil {
			err = errors.New("request body contains multiple JSON values")
			return apperrors.ReqBodyDecodeFailed.Wrap(err, "request body must contain one JSON value")
		}
		return apperrors.ReqBodyDecodeFailed.Wrap(err, "request body contains invalid trailing data")
	}

	return nil
}
