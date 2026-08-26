package service

import (
	"context"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
)

type ArticleRepository interface {
	ListArticles(context.Context) ([]model.Article, error)
	GetArticle(context.Context, string) (model.Article, error)
	SaveArticle(context.Context, model.Article) error
	DeleteArticle(context.Context, string) error
}

type ArticleService struct {
	repository ArticleRepository
}

func NewArticleService(repository ArticleRepository) *ArticleService {
	return &ArticleService{repository: repository}
}

func (s *ArticleService) ListArticles(ctx context.Context) ([]model.Article, error) {
	return s.repository.ListArticles(ctx)
}

func (s *ArticleService) GetArticle(ctx context.Context, id string) (model.Article, error) {
	return s.repository.GetArticle(ctx, id)
}

func (s *ArticleService) SaveArticle(ctx context.Context, article model.Article) error {
	return s.repository.SaveArticle(ctx, article)
}

func (s *ArticleService) DeleteArticle(ctx context.Context, id string) error {
	return s.repository.DeleteArticle(ctx, id)
}
