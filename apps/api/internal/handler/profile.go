package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
)

type ProfileHandler struct {
	service *service.ProfileService
}

func NewProfileHandler(profileService *service.ProfileService) *ProfileHandler {
	return &ProfileHandler{service: profileService}
}

func (h *ProfileHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	profileData, err := h.service.GetProfile(r.Context())
	if err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(profileData); err != nil {
		err = apperrors.ResponseEncodeFailed.Wrap(err, "Failed to encode response body")
		apperrors.ErrorHandler(w, r, err)
		return
	}

	log.Printf("profile request succeeded: method=%s status=%d", r.Method, http.StatusOK)
}

func (h *ProfileHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var profile model.Profile
	if err := decodeJSONBody(w, r, &profile); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}

	if err := h.service.UpdateProfile(r.Context(), profile); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}

	log.Printf("profile update succeeded: status=%d", http.StatusNoContent)
	w.WriteHeader(http.StatusNoContent)
}
