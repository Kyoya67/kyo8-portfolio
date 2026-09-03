package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
	"github.com/gorilla/mux"
)

type CareerHandler struct {
	service *service.CareerService
}

func NewCareerHandler(careerService *service.CareerService) *CareerHandler {
	return &CareerHandler{service: careerService}
}

func (h *CareerHandler) ListCareers(w http.ResponseWriter, r *http.Request) {
	careers, err := h.service.ListCareers(r.Context())
	if err != nil {
		log.Printf("careers request failed: method=%s error=%v", r.Method, err)
		apperrors.ErrorHandler(w, r, err)
		return
	}
	writeJSON(w, r, careers)
}

func (h *CareerHandler) CreateCareer(w http.ResponseWriter, r *http.Request) {
	var career model.Career
	if err := json.NewDecoder(r.Body).Decode(&career); err != nil {
		err = apperrors.ReqBodyDecodeFailed.Wrap(err, "Failed to decode request body")
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
	if err := json.NewDecoder(r.Body).Decode(&career); err != nil {
		err = apperrors.ReqBodyDecodeFailed.Wrap(err, "Failed to decode request body")
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
	if err := h.service.DeleteCareer(r.Context(), mux.Vars(r)["id"]); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
