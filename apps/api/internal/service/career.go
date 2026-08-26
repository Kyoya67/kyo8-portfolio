package service

import (
	"context"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
)

type CareerRepository interface {
	ListCareers(context.Context) ([]model.Career, error)
	GetCareer(context.Context, string) (model.Career, error)
	SaveCareer(context.Context, model.Career) error
	DeleteCareer(context.Context, string) error
}

type CareerService struct {
	repository CareerRepository
}

func NewCareerService(repository CareerRepository) *CareerService {
	return &CareerService{repository: repository}
}

func (s *CareerService) ListCareers(ctx context.Context) ([]model.Career, error) {
	return s.repository.ListCareers(ctx)
}

func (s *CareerService) GetCareer(ctx context.Context, id string) (model.Career, error) {
	return s.repository.GetCareer(ctx, id)
}

func (s *CareerService) SaveCareer(ctx context.Context, career model.Career) error {
	return s.repository.SaveCareer(ctx, career)
}

func (s *CareerService) DeleteCareer(ctx context.Context, id string) error {
	return s.repository.DeleteCareer(ctx, id)
}
