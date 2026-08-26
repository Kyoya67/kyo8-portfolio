package handler

import (
	"encoding/json"
	"log"
	"net/http"

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
		log.Printf("profile request failed: method=%s error=%v", r.Method, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(profileData); err != nil {
		log.Printf("profile response failed: error=%v", err)
		return
	}

	log.Printf("profile request succeeded: method=%s status=%d", r.Method, http.StatusOK)
}

func (h *ProfileHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var profile model.Profile
	if err := json.NewDecoder(r.Body).Decode(&profile); err != nil {
		log.Printf("profile update failed: error=%v", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	if err := h.service.UpdateProfile(r.Context(), profile); err != nil {
		log.Printf("profile update failed: error=%v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	log.Printf("profile update succeeded: status=%d", http.StatusNoContent)
	w.WriteHeader(http.StatusNoContent)
}
