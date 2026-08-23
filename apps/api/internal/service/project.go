package service

import (
	"context"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
)

type ProjectRepository interface {
	ListProjects(context.Context, bool) ([]model.Project, error)
	GetProject(context.Context, string) (model.Project, error)
	SaveProject(context.Context, model.Project) error
	DeleteProject(context.Context, string) error
}

type ProjectService struct {
	repository ProjectRepository
}

func NewProjectService(repository ProjectRepository) *ProjectService {
	return &ProjectService{repository: repository}
}

func (s *ProjectService) ListPublicProjects(ctx context.Context) ([]model.Project, error) {
	return s.repository.ListProjects(ctx, true)
}

func (s *ProjectService) ListProjects(ctx context.Context) ([]model.Project, error) {
	return s.repository.ListProjects(ctx, false)
}

func (s *ProjectService) GetProject(ctx context.Context, id string) (model.Project, error) {
	return s.repository.GetProject(ctx, id)
}

func (s *ProjectService) SaveProject(ctx context.Context, project model.Project) error {
	return s.repository.SaveProject(ctx, project)
}

func (s *ProjectService) DeleteProject(ctx context.Context, id string) error {
	return s.repository.DeleteProject(ctx, id)
}
