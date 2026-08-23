package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
)

type SkillHandler struct {
	service *service.SkillService
}

func NewSkillHandler(skillService *service.SkillService) *SkillHandler {
	return &SkillHandler{service: skillService}
}

func (h *SkillHandler) GetSkills(w http.ResponseWriter, r *http.Request) {
	skills, err := h.service.GetSkills(r.Context())
	if err != nil {
		log.Printf("skills request failed: method=%s error=%v", r.Method, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(skills); err != nil {
		log.Printf("skills response failed: error=%v", err)
		return
	}
	log.Printf("skills request succeeded: method=%s status=%d", r.Method, http.StatusOK)
}

func (h *SkillHandler) UpdateSkills(w http.ResponseWriter, r *http.Request) {
	var skills []model.Skill
	if err := json.NewDecoder(r.Body).Decode(&skills); err != nil {
		log.Printf("skills update failed: error=%v", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	if err := h.service.UpdateSkills(r.Context(), skills); err != nil {
		log.Printf("skills update failed: error=%v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	log.Printf("skills update succeeded: status=%d", http.StatusNoContent)
	w.WriteHeader(http.StatusNoContent)
}
