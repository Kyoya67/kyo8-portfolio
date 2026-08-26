package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
	"github.com/gorilla/mux"
)

type ProjectHandler struct {
	service      *service.ProjectService
	imageService *service.ImageUploadService
}

func NewProjectHandler(projectService *service.ProjectService, imageService *service.ImageUploadService) *ProjectHandler {
	return &ProjectHandler{service: projectService, imageService: imageService}
}

func (h *ProjectHandler) ListProjects(w http.ResponseWriter, r *http.Request) {
	projects, err := h.service.ListProjects(r.Context())
	if err != nil {
		log.Printf("projects request failed: method=%s error=%v", r.Method, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	writeJSON(w, projects)
}

func (h *ProjectHandler) GetProject(w http.ResponseWriter, r *http.Request) {
	project, err := h.service.GetProject(r.Context(), mux.Vars(r)["id"])
	if err != nil {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
	writeJSON(w, project)
}

func (h *ProjectHandler) CreateProject(w http.ResponseWriter, r *http.Request) {
	var project model.Project
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if project.ID == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if err := h.service.SaveProject(r.Context(), project); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *ProjectHandler) UpdateProject(w http.ResponseWriter, r *http.Request) {
	var project model.Project
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	project.ID = mux.Vars(r)["id"]
	if project.ID == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if err := h.service.SaveProject(r.Context(), project); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *ProjectHandler) DeleteProject(w http.ResponseWriter, r *http.Request) {
	if err := h.service.DeleteProject(r.Context(), mux.Vars(r)["id"]); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *ProjectHandler) CreateImageUploadURL(w http.ResponseWriter, r *http.Request) {
	var input service.ImageUpload
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	result, err := h.imageService.CreateUploadURL(r.Context(), mux.Vars(r)["id"], input)
	if err != nil {
		log.Printf("project image upload URL failed: error=%v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	writeJSON(w, result)
}

func writeJSON(w http.ResponseWriter, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(value); err != nil {
		log.Printf("json response failed: error=%v", err)
	}
}
