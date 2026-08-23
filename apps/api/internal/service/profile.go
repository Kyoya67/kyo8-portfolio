package service

import (
	"context"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
)

type ProfileRepository interface {
	GetProfile(ctx context.Context) (model.Profile, error)
}

type ProfileService struct {
	repository ProfileRepository
}

func NewProfileService(repository ProfileRepository) *ProfileService {
	return &ProfileService{repository: repository}
}

func (s *ProfileService) GetProfile(ctx context.Context) (model.Profile, error) {
	return s.repository.GetProfile(ctx)
}
