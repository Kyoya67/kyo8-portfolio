package service

import (
	"context"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"testing"
)

type certificationRepositoryFake struct{ saved *model.Certification }

func (f *certificationRepositoryFake) ListCertifications(context.Context) ([]model.Certification, error) {
	return nil, nil
}
func (f *certificationRepositoryFake) SaveCertification(_ context.Context, c model.Certification) error {
	f.saved = &c
	return nil
}
func (f *certificationRepositoryFake) DeleteCertification(context.Context, string) error { return nil }
func TestSaveCertificationValidation(t *testing.T) {
	valid := model.Certification{ID: "saa", Name: model.LocalizedText{EN: "SAA", JA: "SAA"}, Issuer: "AWS", AcquiredDate: "2026-10", Order: 1}
	for _, tc := range []struct {
		name   string
		mutate func(*model.Certification)
	}{
		{"blank id", func(c *model.Certification) { c.ID = " " }},
		{"blank English name", func(c *model.Certification) { c.Name.EN = " " }},
		{"blank Japanese name", func(c *model.Certification) { c.Name.JA = "" }},
		{"blank issuer", func(c *model.Certification) { c.Issuer = " " }},
		{"invalid month", func(c *model.Certification) { c.AcquiredDate = "2026-13" }},
		{"missing month", func(c *model.Certification) { c.AcquiredDate = "" }},
		{"day precision", func(c *model.Certification) { c.AcquiredDate = "2026-10-19" }},
		{"negative order", func(c *model.Certification) { c.Order = -1 }},
	} {
		t.Run(tc.name, func(t *testing.T) {
			c := valid
			tc.mutate(&c)
			repo := &certificationRepositoryFake{}
			if err := NewCertificationService(repo).SaveCertification(context.Background(), c); err == nil {
				t.Fatal("expected validation error")
			}
			if repo.saved != nil {
				t.Fatal("invalid data was persisted")
			}
		})
	}
	repo := &certificationRepositoryFake{}
	c := valid
	c.Name.EN = " SAA "
	c.Issuer = " AWS "
	if err := NewCertificationService(repo).SaveCertification(context.Background(), c); err != nil {
		t.Fatal(err)
	}
	if repo.saved.Name.EN != "SAA" || repo.saved.Issuer != "AWS" {
		t.Fatal("not normalized")
	}
}
