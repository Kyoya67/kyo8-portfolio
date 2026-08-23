package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
)

type ProfileHandler struct {
	service *service.ProfileService
}

func NewProfileHandler(profileService *service.ProfileService) *ProfileHandler {
	return &ProfileHandler{service: profileService}
}

func (h *ProfileHandler) Profile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		log.Printf("profile request failed: method=%s status=%d", r.Method, http.StatusMethodNotAllowed)
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

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
