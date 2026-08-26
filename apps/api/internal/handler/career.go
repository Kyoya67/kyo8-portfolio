package handler

import (
	"encoding/json"
	"log"
	"net/http"

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
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	writeJSON(w, careers)
}

func (h *CareerHandler) CreateCareer(w http.ResponseWriter, r *http.Request) {
	var career model.Career
	if err := json.NewDecoder(r.Body).Decode(&career); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if career.ID == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if err := h.service.SaveCareer(r.Context(), career); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *CareerHandler) UpdateCareer(w http.ResponseWriter, r *http.Request) {
	var career model.Career
	if err := json.NewDecoder(r.Body).Decode(&career); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	career.ID = mux.Vars(r)["id"]
	if career.ID == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if err := h.service.SaveCareer(r.Context(), career); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *CareerHandler) DeleteCareer(w http.ResponseWriter, r *http.Request) {
	if err := h.service.DeleteCareer(r.Context(), mux.Vars(r)["id"]); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
