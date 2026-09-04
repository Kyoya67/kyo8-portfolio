package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
	"github.com/gorilla/mux"
)

type ArticleHandler struct {
	service     *service.ArticleService
	zennService *service.ZennService
}

func NewArticleHandler(articleService *service.ArticleService, zennService *service.ZennService) *ArticleHandler {
	return &ArticleHandler{service: articleService, zennService: zennService}
}

func (h *ArticleHandler) ListArticles(w http.ResponseWriter, r *http.Request) {
	articles, err := h.service.ListArticles(r.Context())
	if err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	writeJSON(w, r, articles)
}

func (h *ArticleHandler) GetArticle(w http.ResponseWriter, r *http.Request) {
	article, err := h.service.GetArticle(r.Context(), mux.Vars(r)["id"])
	if err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	writeJSON(w, r, article)
}

func (h *ArticleHandler) CreateArticle(w http.ResponseWriter, r *http.Request) {
	var article model.Article
	if err := json.NewDecoder(r.Body).Decode(&article); err != nil {
		err = apperrors.ReqBodyDecodeFailed.Wrap(err, "Failed to decode request body")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if article.ID == "" {
		err := apperrors.BadParam.Wrap(nil, "article id is required")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if err := h.service.SaveArticle(r.Context(), article); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *ArticleHandler) UpdateArticle(w http.ResponseWriter, r *http.Request) {
	var article model.Article
	if err := json.NewDecoder(r.Body).Decode(&article); err != nil {
		err = apperrors.ReqBodyDecodeFailed.Wrap(err, "Failed to decode request body")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	article.ID = mux.Vars(r)["id"]
	if article.ID == "" {
		err := apperrors.BadParam.Wrap(nil, "article id is required")
		apperrors.ErrorHandler(w, r, err)
		return
	}
	if err := h.service.SaveArticle(r.Context(), article); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *ArticleHandler) DeleteArticle(w http.ResponseWriter, r *http.Request) {
	if err := h.service.DeleteArticle(r.Context(), mux.Vars(r)["id"]); err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *ArticleHandler) SyncZennArticles(w http.ResponseWriter, r *http.Request) {
	count, err := h.zennService.SyncArticles(r.Context())
	if err != nil {
		apperrors.ErrorHandler(w, r, err)
		return
	}
	writeJSON(w, r, map[string]int{"synced": count})
}
