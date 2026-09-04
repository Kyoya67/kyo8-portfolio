package service

import (
	"context"
	"encoding/xml"
	"errors"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
)

const defaultZennFeedURL = "https://zenn.dev/kyoya08/feed"

type zennFeed struct {
	Items []zennItem `xml:"channel>item"`
}

type zennItem struct {
	Title       string `xml:"title"`
	Description string `xml:"description"`
	Link        string `xml:"link"`
	PublishedAt string `xml:"pubDate"`
	Enclosure   struct {
		URL string `xml:"url,attr"`
	} `xml:"enclosure"`
	MediaContent struct {
		URL string `xml:"url,attr"`
	} `xml:"content"`
}

type ZennArticleRepository interface {
	ListArticles(context.Context) ([]model.Article, error)
	SaveArticle(context.Context, model.Article) error
	DeleteArticle(context.Context, string) error
}

type ZennService struct {
	repository ZennArticleRepository
	client     *http.Client
	feedURL    string
}

func NewZennService(repository ZennArticleRepository) *ZennService {
	return &ZennService{
		repository: repository,
		client:     &http.Client{Timeout: 10 * time.Second},
		feedURL:    defaultZennFeedURL,
	}
}

func (s *ZennService) SyncArticles(ctx context.Context) (int, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, s.feedURL, nil)
	if err != nil {
		return 0, fmt.Errorf("create Zenn RSS request: %w", err)
	}

	res, err := s.client.Do(req)
	if err != nil {
		return 0, classifyZennHTTPError(err)
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return 0, classifyZennStatusError(res.StatusCode)
	}

	var feed zennFeed
	if err := xml.NewDecoder(res.Body).Decode(&feed); err != nil {
		return 0, apperrors.DataMappingFailed.Wrap(err, "failed to decode Zenn RSS")
	}
	if len(feed.Items) == 0 {
		err := errors.New("Zenn RSS contains no articles; skip deletion to protect existing data")
		return 0, apperrors.ExternalServiceFailed.Wrap(err, "Zenn RSS returned no articles")
	}

	feedArticleIDs := make(map[string]struct{}, len(feed.Items))
	for order, item := range feed.Items {
		article, err := convertZennItem(item, order+1)
		if err != nil {
			return 0, apperrors.DataMappingFailed.Wrap(err, "failed to convert Zenn article")
		}
		if err := s.repository.SaveArticle(ctx, article); err != nil {
			return 0, fmt.Errorf("save Zenn article %s: %w", article.ID, err)
		}
		feedArticleIDs[article.ID] = struct{}{}
	}

	existingArticles, err := s.repository.ListArticles(ctx)
	if err != nil {
		return 0, fmt.Errorf("list existing Zenn articles: %w", err)
	}
	for _, article := range existingArticles {
		if article.Source != "zenn" {
			continue
		}
		if _, exists := feedArticleIDs[article.ID]; exists {
			continue
		}
		if err := s.repository.DeleteArticle(ctx, article.ID); err != nil {
			return 0, fmt.Errorf("delete removed Zenn article %s: %w", article.ID, err)
		}
	}

	return len(feed.Items), nil
}

func classifyZennHTTPError(err error) error {
	if errors.Is(err, context.Canceled) {
		return err
	}

	if errors.Is(err, context.DeadlineExceeded) {
		return apperrors.Timeout.Wrap(err, "Zenn RSS request timed out")
	}

	var netErr net.Error
	if errors.As(err, &netErr) && netErr.Timeout() {
		return apperrors.Timeout.Wrap(err, "Zenn RSS request timed out")
	}

	return apperrors.ExternalServiceFailed.Wrap(err, "failed to fetch Zenn RSS")
}

func classifyZennStatusError(statusCode int) error {
	err := fmt.Errorf("Zenn RSS returned status=%d", statusCode)

	switch {
	case statusCode == http.StatusTooManyRequests:
		return apperrors.DependencyThrottled.Wrap(err, "Zenn RSS request was throttled")
	case statusCode >= http.StatusInternalServerError:
		return apperrors.DependencyUnavailable.Wrap(err, "Zenn RSS is unavailable")
	default:
		return apperrors.ExternalServiceFailed.Wrap(err, "Zenn RSS request failed")
	}
}

func convertZennItem(item zennItem, order int) (model.Article, error) {
	parsedURL, err := url.Parse(item.Link)
	if err != nil || parsedURL.Path == "" {
		return model.Article{}, fmt.Errorf("invalid Zenn article URL: %q", item.Link)
	}
	parts := strings.Split(strings.Trim(parsedURL.Path, "/"), "/")
	slug := parts[len(parts)-1]
	if slug == "" {
		return model.Article{}, fmt.Errorf("missing Zenn article slug: %q", item.Link)
	}

	publishedAt, err := time.Parse(time.RFC1123, item.PublishedAt)
	if err != nil {
		return model.Article{}, fmt.Errorf("parse Zenn publication date: %w", err)
	}

	return model.Article{
		ID:   "zenn-" + slug,
		Slug: &slug,
		Title: model.LocalizedText{
			EN: item.Title,
			JA: item.Title,
		},
		Summary: model.LocalizedText{
			EN: item.Description,
			JA: item.Description,
		},
		URL:         item.Link,
		ImageURL:    firstNonEmpty(item.Enclosure.URL, item.MediaContent.URL),
		Source:      "zenn",
		SourceLabel: "Zenn",
		PublishedAt: publishedAt.UTC().Format(time.RFC3339),
		Published:   true,
		Order:       order,
	}, nil
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}
