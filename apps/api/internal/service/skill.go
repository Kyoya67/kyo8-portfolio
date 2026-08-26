package service

import (
	"context"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
)

type SkillRepository interface {
	GetSkills(ctx context.Context) ([]model.Skill, error)
	UpdateSkills(ctx context.Context, skills []model.Skill) error
}

type SkillService struct {
	repository SkillRepository
}

func NewSkillService(repository SkillRepository) *SkillService {
	return &SkillService{repository: repository}
}

func (s *SkillService) GetSkills(ctx context.Context) ([]model.Skill, error) {
	return s.repository.GetSkills(ctx)
}

func (s *SkillService) UpdateSkills(ctx context.Context, skills []model.Skill) error {
	return s.repository.UpdateSkills(ctx, skills)
}
