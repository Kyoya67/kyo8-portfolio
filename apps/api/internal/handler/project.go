package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
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

func (h *ProjectHandler) ListProjects(w http.ResponseWriter, r *http.Request) {
	projects, err := h.service.ListProjects(r.Context())
	if err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	writeJSON(w, r, projects)
}

func (h *ProjectHandler) GetProject(w http.ResponseWriter, r *http.Request) {
	project, err := h.service.GetProject(r.Context(), mux.Vars(r)["id"])
	if err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	writeJSON(w, r, project)
}

func (h *ProjectHandler) CreateProject(w http.ResponseWriter, r *http.Request) {
	var project model.Project
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		err = apperrors.ReqBodyDecodeFailed.Wrap(err, "Failed to decode request body")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if project.ID == "" {
		err := apperrors.BadParam.Wrap(nil, "project id is required")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if err := h.service.SaveProject(r.Context(), project); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *ProjectHandler) UpdateProject(w http.ResponseWriter, r *http.Request) {
	var project model.Project
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		err = apperrors.ReqBodyDecodeFailed.Wrap(err, "Failed to decode request body")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	project.ID = mux.Vars(r)["id"]
	if project.ID == "" {
		err := apperrors.BadParam.Wrap(nil, "project id is required")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if err := h.service.SaveProject(r.Context(), project); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *ProjectHandler) DeleteProject(w http.ResponseWriter, r *http.Request) {
	if err := h.service.DeleteProject(r.Context(), mux.Vars(r)["id"]); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
