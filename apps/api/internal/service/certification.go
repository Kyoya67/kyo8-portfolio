package service

import (
	"context"
	"strings"
	"time"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
)

type CertificationRepository interface {
	ListCertifications(context.Context) ([]model.Certification, error)
	SaveCertification(context.Context, model.Certification) error
	DeleteCertification(context.Context, string) error
}

type CertificationService struct {
	repository CertificationRepository
}

func NewCertificationService(repository CertificationRepository) *CertificationService {
	return &CertificationService{repository: repository}
}

func (s *CertificationService) ListCertifications(ctx context.Context) ([]model.Certification, error) {
	return s.repository.ListCertifications(ctx)
}

func (s *CertificationService) SaveCertification(ctx context.Context, certification model.Certification) error {
	certification.ID = strings.TrimSpace(certification.ID)
	certification.Name.EN = strings.TrimSpace(certification.Name.EN)
	certification.Name.JA = strings.TrimSpace(certification.Name.JA)
	certification.Issuer = strings.TrimSpace(certification.Issuer)
	if certification.ID == "" || certification.Name.EN == "" || certification.Name.JA == "" || certification.Issuer == "" {
		return apperrors.BadParam.Wrap(nil, "id, English and Japanese names, and issuer are required")
	}
	if _, err := time.Parse("2006-01", certification.AcquiredDate); err != nil {
		return apperrors.BadParam.Wrap(err, "acquiredDate must be a valid YYYY-MM month")
	}
	if certification.Order < 0 {
		return apperrors.BadParam.Wrap(nil, "order must be non-negative")
	}
	return s.repository.SaveCertification(ctx, certification)
}

func (s *CertificationService) DeleteCertification(ctx context.Context, id string) error {
	return s.repository.DeleteCertification(ctx, id)
}
