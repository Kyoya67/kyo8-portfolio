package handler

import (
	"context"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/gorilla/mux"
)

type certificationService interface {
	ListCertifications(context.Context) ([]model.Certification, error)
	SaveCertification(context.Context, model.Certification) error
	DeleteCertification(context.Context, string) error
}

type CertificationHandler struct {
	service certificationService
}

func NewCertificationHandler(certificationService certificationService) *CertificationHandler {
	return &CertificationHandler{service: certificationService}
}

func (h *CertificationHandler) ListCertifications(w http.ResponseWriter, r *http.Request) {
	certifications, err := h.service.ListCertifications(r.Context())
	if err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	writeJSON(w, r, certifications)
}

func (h *CertificationHandler) CreateCertification(w http.ResponseWriter, r *http.Request) {
	var certification model.Certification
	if err := decodeJSONBody(w, r, &certification); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if certification.ID == "" {
		err := apperrors.BadParam.Wrap(nil, "certification id is required")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if err := h.service.SaveCertification(r.Context(), certification); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *CertificationHandler) UpdateCertification(w http.ResponseWriter, r *http.Request) {
	var certification model.Certification
	if err := decodeJSONBody(w, r, &certification); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	certification.ID = mux.Vars(r)["id"]
	if certification.ID == "" {
		err := apperrors.BadParam.Wrap(nil, "certification id is required")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if err := h.service.SaveCertification(r.Context(), certification); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *CertificationHandler) DeleteCertification(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if id == "" {
		err := apperrors.BadParam.Wrap(nil, "certification id is required")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if err := h.service.DeleteCertification(r.Context(), id); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
