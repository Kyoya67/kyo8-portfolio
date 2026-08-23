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
	service *service.ProjectService
}

func NewProjectHandler(projectService *service.ProjectService) *ProjectHandler {
	return &ProjectHandler{service: projectService}
}

func (h *ProjectHandler) ListPublicProjects(w http.ResponseWriter, r *http.Request) {
	h.list(w, r, true)
}

func (h *ProjectHandler) ListProjects(w http.ResponseWriter, r *http.Request) {
	h.list(w, r, false)
}

func (h *ProjectHandler) list(w http.ResponseWriter, r *http.Request, publishedOnly bool) {
	var projects []model.Project
	var err error
	if publishedOnly {
		projects, err = h.service.ListPublicProjects(r.Context())
	} else {
		projects, err = h.service.ListProjects(r.Context())
	}
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
	h.save(w, r)
}

func (h *ProjectHandler) UpdateProject(w http.ResponseWriter, r *http.Request) {
	h.save(w, r)
}

func (h *ProjectHandler) save(w http.ResponseWriter, r *http.Request) {
	var project model.Project
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if id := mux.Vars(r)["id"]; id != "" {
		project.ID = id
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

func (h *ProjectHandler) DeleteProject(w http.ResponseWriter, r *http.Request) {
	if err := h.service.DeleteProject(r.Context(), mux.Vars(r)["id"]); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func writeJSON(w http.ResponseWriter, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(value); err != nil {
		log.Printf("json response failed: error=%v", err)
	}
}
