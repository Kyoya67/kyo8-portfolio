package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
	"github.com/gorilla/mux"
)

type ArticleHandler struct {
	service *service.ArticleService
}

func NewArticleHandler(articleService *service.ArticleService) *ArticleHandler {
	return &ArticleHandler{service: articleService}
}

func (h *ArticleHandler) ListArticles(w http.ResponseWriter, r *http.Request) {
	articles, err := h.service.ListArticles(r.Context())
	if err != nil {
		log.Printf("articles request failed: method=%s error=%v", r.Method, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	writeJSON(w, articles)
}

func (h *ArticleHandler) GetArticle(w http.ResponseWriter, r *http.Request) {
	article, err := h.service.GetArticle(r.Context(), mux.Vars(r)["id"])
	if err != nil {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
	writeJSON(w, article)
}

func (h *ArticleHandler) CreateArticle(w http.ResponseWriter, r *http.Request) {
	var article model.Article
	if err := json.NewDecoder(r.Body).Decode(&article); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if article.ID == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if err := h.service.SaveArticle(r.Context(), article); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *ArticleHandler) UpdateArticle(w http.ResponseWriter, r *http.Request) {
	var article model.Article
	if err := json.NewDecoder(r.Body).Decode(&article); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	article.ID = mux.Vars(r)["id"]
	if article.ID == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if err := h.service.SaveArticle(r.Context(), article); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *ArticleHandler) DeleteArticle(w http.ResponseWriter, r *http.Request) {
	if err := h.service.DeleteArticle(r.Context(), mux.Vars(r)["id"]); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
