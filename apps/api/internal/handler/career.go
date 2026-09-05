package handler

import (
	"context"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/gorilla/mux"
)

type careerService interface {
	ListCareers(context.Context) ([]model.Career, error)
	SaveCareer(context.Context, model.Career) error
	DeleteCareer(context.Context, string) error
}

type CareerHandler struct {
	service careerService
}

func NewCareerHandler(careerService careerService) *CareerHandler {
	return &CareerHandler{service: careerService}
}

func (h *CareerHandler) ListCareers(w http.ResponseWriter, r *http.Request) {
	careers, err := h.service.ListCareers(r.Context())
	if err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	writeJSON(w, r, careers)
}

func (h *CareerHandler) CreateCareer(w http.ResponseWriter, r *http.Request) {
	var career model.Career
	if err := decodeJSONBody(w, r, &career); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if career.ID == "" {
		err := apperrors.BadParam.Wrap(nil, "career id is required")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if err := h.service.SaveCareer(r.Context(), career); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *CareerHandler) UpdateCareer(w http.ResponseWriter, r *http.Request) {
	var career model.Career
	if err := decodeJSONBody(w, r, &career); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	career.ID = mux.Vars(r)["id"]
	if career.ID == "" {
		err := apperrors.BadParam.Wrap(nil, "career id is required")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if err := h.service.SaveCareer(r.Context(), career); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *CareerHandler) DeleteCareer(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if id == "" {
		err := apperrors.BadParam.Wrap(nil, "career id is required")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if err := h.service.DeleteCareer(r.Context(), id); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
