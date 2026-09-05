package handler

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/gorilla/mux"
)

type articleServiceFake struct{ err error }

func (f articleServiceFake) ListArticles(context.Context) ([]model.Article, error) {
	return []model.Article{{URL: "https://example.com"}}, f.err
}
func (f articleServiceFake) GetArticle(context.Context, string) (model.Article, error) {
	return model.Article{URL: "https://example.com"}, f.err
}
func (f articleServiceFake) SaveArticle(context.Context, model.Article) error { return f.err }
func (f articleServiceFake) DeleteArticle(context.Context, string) error      { return f.err }

type zennServiceFake struct {
	count int
	err   error
}

func (f zennServiceFake) SyncArticles(context.Context) (int, error) { return f.count, f.err }

/*
 ******************************************************************************
 * ListArticles
 * - 正常に記事一覧を取得した場合に、記事一覧をJSONで返し、200を返すこと
 * - Serviceエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestArticleHandlerListArticles(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
		req := httptest.NewRequest(http.MethodGet, "/articles", nil)
		h.ListArticles(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("status = %d", w.Code)
		}
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{err: sharedDependencyError()}, zennServiceFake{})
		req := httptest.NewRequest(http.MethodGet, "/articles", nil)
		h.ListArticles(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * GetArticle
 * - URLパラメータのidが指定された場合に、idを使って記事を取得し、200を返すこと
 * - URLパラメータのidが空の場合に、BadParam / 400を返すこと
 * - Serviceエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestArticleHandlerGetArticle(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
		req := articleRequest(http.MethodGet, "/articles/a1", "a1", nil)
		h.GetArticle(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("status = %d", w.Code)
		}
	})
	t.Run("missing id", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
		req := articleRequest(http.MethodGet, "/articles/", "", nil)
		h.GetArticle(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.BadParam, "article id is required")
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{err: sharedDependencyError()}, zennServiceFake{})
		req := articleRequest(http.MethodGet, "/articles/a1", "a1", nil)
		h.GetArticle(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * CreateArticle
 * - 正常なJSONを受け取った場合に、記事を保存し、204を返すこと
 * - JSON形式が不正な場合に、ReqBodyDecodeFailed / 400を返すこと
 * - リクエストボディのidがない場合に、BadParam / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestArticleHandlerCreateArticle(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/articles", strings.NewReader(`{"id":"a1"}`))
		h.CreateArticle(w, req)
		if w.Code != http.StatusNoContent {
			t.Errorf("status = %d", w.Code)
		}
	})
	t.Run("invalid body", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/articles", strings.NewReader("invalid"))
		h.CreateArticle(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.ReqBodyDecodeFailed, "Failed to decode request body")
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{err: sharedDependencyError()}, zennServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/articles", strings.NewReader(`{"id":"a1"}`))
		h.CreateArticle(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
	t.Run("missing id", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
		req := httptest.NewRequest(http.MethodPost, "/admin/articles", strings.NewReader(`{"title":{}}`))
		h.CreateArticle(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.BadParam, "article id is required")
	})
}

/*
 ******************************************************************************
 * UpdateArticle
 * - 正常なJSONを受け取った場合に記事を保存し、204を返すこと
 * - JSON形式が不正な場合にReqBodyDecodeFailed / 400を返すこと
 * - URLパラメータのidがない場合にBadParam / 400を返すこと
 * - Serviceエラー時にDependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestArticleHandlerUpdateArticle(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
		req := articleRequest(http.MethodPut, "/admin/articles/a1", "a1", strings.NewReader(`{"title":{"en":"Updated"}}`))
		h.UpdateArticle(w, req)
		if w.Code != http.StatusNoContent {
			t.Errorf("status = %d", w.Code)
		}
	})
	t.Run("invalid body", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
		req := articleRequest(http.MethodPut, "/admin/articles/a1", "a1", strings.NewReader("invalid"))
		h.UpdateArticle(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.ReqBodyDecodeFailed, "Failed to decode request body")
	})
	t.Run("missing id", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
		req := articleRequest(http.MethodPut, "/admin/articles/", "", strings.NewReader(`{"title":{}}`))
		h.UpdateArticle(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.BadParam, "article id is required")
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{err: sharedDependencyError()}, zennServiceFake{})
		req := articleRequest(http.MethodPut, "/admin/articles/a1", "a1", strings.NewReader(`{"title":{}}`))
		h.UpdateArticle(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * DeleteArticle
 * - 正常なidパラメータが指定された場合に、記事を削除し、204を返すこと
 * - idが空の場合にBadParam / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestArticleHandlerDeleteArticle(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
		req := articleRequest(http.MethodDelete, "/admin/articles/a1", "a1", nil)
		h.DeleteArticle(w, req)
		if w.Code != http.StatusNoContent {
			t.Errorf("status = %d", w.Code)
		}
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{err: sharedDependencyError()}, zennServiceFake{})
		req := articleRequest(http.MethodDelete, "/admin/articles/a1", "a1", nil)
		h.DeleteArticle(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
	t.Run("missing id", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
		req := articleRequest(http.MethodDelete, "/admin/articles/", "", nil)
		h.DeleteArticle(w, req)
		assertSharedError(t, w, http.StatusBadRequest, apperrors.BadParam, "article id is required")
	})
}

/*
 ******************************************************************************
 * SyncZennArticles
 * - Zenn記事の同期に成功した場合に、同期件数をJSONで返し、200を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
func TestArticleHandlerSyncZennArticles(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{count: 2})
		req := httptest.NewRequest(http.MethodPost, "/admin/articles/sync-zenn", nil)
		h.SyncZennArticles(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("status = %d", w.Code)
		}
	})
	t.Run("service error", func(t *testing.T) {
		w := httptest.NewRecorder()
		h := NewArticleHandler(articleServiceFake{}, zennServiceFake{err: sharedDependencyError()})
		req := httptest.NewRequest(http.MethodPost, "/admin/articles/sync-zenn", nil)
		h.SyncZennArticles(w, req)
		assertSharedError(t, w, http.StatusServiceUnavailable, apperrors.DependencyUnavailable, "temporarily unavailable")
	})
}

/*
 ******************************************************************************
 * articleRequest
 * - テスト用Requestを作成し、URLパラメータのidを設定すること
 ******************************************************************************
 */
func articleRequest(method, target, id string, body io.Reader) *http.Request {
	return mux.SetURLVars(httptest.NewRequest(method, target, body), map[string]string{"id": id})
}
