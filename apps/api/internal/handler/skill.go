package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
)

type skillService interface {
	GetSkills(context.Context) ([]model.Skill, error)
	UpdateSkills(context.Context, []model.Skill) error
}

type SkillHandler struct {
	service skillService
}

func NewSkillHandler(skillService skillService) *SkillHandler {
	return &SkillHandler{service: skillService}
}

func (h *SkillHandler) GetSkills(w http.ResponseWriter, r *http.Request) {
	skills, err := h.service.GetSkills(r.Context())
	if err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(skills); err != nil {
		err = apperrors.ResponseEncodeFailed.Wrap(err, "Failed to encode response body")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	log.Printf("skills request succeeded: method=%s status=%d", r.Method, http.StatusOK)
}

func (h *SkillHandler) UpdateSkills(w http.ResponseWriter, r *http.Request) {
	var skills []model.Skill
	if err := decodeJSONBody(w, r, &skills); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}

	if err := h.service.UpdateSkills(r.Context(), skills); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}

	log.Printf("skills update succeeded: status=%d", http.StatusNoContent)
	w.WriteHeader(http.StatusNoContent)
}
