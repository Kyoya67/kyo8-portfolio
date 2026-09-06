package repository

import (
	"context"
	"errors"
	"reflect"
	"testing"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

/*
 ******************************************************************************
 * Test Models
 ******************************************************************************
 */
func testArticles() []model.Article {
	slug1 := "first-article"
	slug2 := "second-article"
	return []model.Article{{
		ID: "a1", Slug: &slug1,
		Title:    model.LocalizedText{EN: "First", JA: "1つ目"},
		Summary:  model.LocalizedText{EN: "Summary", JA: "概要"},
		Body:     model.LocalizedText{EN: "Body", JA: "本文"},
		URL:      "https://example.com/a1",
		ImageURL: "https://example.com/a1.png",
		Source:   "zenn", SourceLabel: "Zenn",
		PublishedAt: "2026-09-01",
		Published:   true, Order: 1,
	}, {
		ID:   "a2",
		Slug: &slug2, Title: model.LocalizedText{EN: "Second", JA: "2つ目"},
		Summary:  model.LocalizedText{EN: "Second summary", JA: "2つ目の概要"},
		Body:     model.LocalizedText{EN: "Second body", JA: "2つ目の本文"},
		URL:      "https://example.com/a2",
		ImageURL: "https://example.com/a2.png",
		Source:   "manual", SourceLabel: "Manual",
		PublishedAt: "2026-09-02",
		Published:   false, Order: 2,
	}}
}

func newArticleRepository(db dynamoAPI) *ArticleRepository {
	return NewArticleRepository(db, "articles")
}

/*
 ******************************************************************************
 * GetArticle
 * - 指定したArticleを取得して全フィールドをモデルへ変換すること
 * - データ未存在、データ変換エラー、DynamoDBエラーを分類すること
 ******************************************************************************
 */
func TestArticleRepositoryGetArticle(t *testing.T) {
	want := testArticles()[0]
	item, err := attributevalue.MarshalMap(want)
	if err != nil {
		t.Fatal(err)
	}
	t.Run("successfully gets and decodes an article", func(t *testing.T) {
		got, err := newArticleRepository(fakeDynamo{getOutput: &dynamodb.GetItemOutput{Item: item}}).GetArticle(context.Background(), "a1")
		if err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("article = %+v, want %+v", got, want)
		}
	})
	t.Run("returns NotFound when article does not exist", func(t *testing.T) {
		_, err := newArticleRepository(fakeDynamo{getOutput: &dynamodb.GetItemOutput{}}).GetArticle(context.Background(), "a1")
		assertRepositoryError(t, err, apperrors.NotFound)
	})
	t.Run("classifies invalid data as DataMappingFailed", func(t *testing.T) {
		_, err := newArticleRepository(fakeDynamo{getOutput: &dynamodb.GetItemOutput{Item: map[string]types.AttributeValue{"title": &types.AttributeValueMemberS{Value: "invalid"}}}}).GetArticle(context.Background(), "a1")
		assertRepositoryError(t, err, apperrors.DataMappingFailed)
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		_, err := newArticleRepository(fakeDynamo{err: errors.New("dependency down")}).GetArticle(context.Background(), "a1")
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}

/*
 ******************************************************************************
 * ListArticles
 * - 複数のArticleを取得して全フィールドをモデルへ変換すること
 * - 0件の場合にNotFoundを返すこと
 * - データ変換エラーとDynamoDBエラーを分類すること
 ******************************************************************************
 */
func TestArticleRepositoryListArticles(t *testing.T) {
	want := testArticles()
	items := make([]map[string]types.AttributeValue, 0, len(want))
	for _, article := range want {
		item, err := attributevalue.MarshalMap(article)
		if err != nil {
			t.Fatal(err)
		}
		items = append(items, item)
	}
	t.Run("successfully lists and decodes articles", func(t *testing.T) {
		got, err := newArticleRepository(fakeDynamo{scanOutput: &dynamodb.ScanOutput{Items: items}}).ListArticles(context.Background())
		if err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("articles = %+v, want %+v", got, want)
		}
	})
	t.Run("returns NotFound when no articles exist", func(t *testing.T) {
		_, err := newArticleRepository(fakeDynamo{scanOutput: &dynamodb.ScanOutput{}}).ListArticles(context.Background())
		assertRepositoryError(t, err, apperrors.NotFound)
	})
	t.Run("classifies invalid data as DataMappingFailed", func(t *testing.T) {
		_, err := newArticleRepository(fakeDynamo{scanOutput: &dynamodb.ScanOutput{Items: []map[string]types.AttributeValue{{"title": &types.AttributeValueMemberS{Value: "invalid"}}}}}).ListArticles(context.Background())
		assertRepositoryError(t, err, apperrors.DataMappingFailed)
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		_, err := newArticleRepository(fakeDynamo{err: errors.New("dependency down")}).ListArticles(context.Background())
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}

/*
 ******************************************************************************
 * SaveArticle
 * - 正常なArticleをDynamoDBへ保存し、保存内容の全フィールドを検証すること
 * - DynamoDBエラーをDependencyUnavailableへ変換すること
 ******************************************************************************
 */
func TestArticleRepositorySaveArticle(t *testing.T) {
	want := testArticles()[0]
	t.Run("successfully saves an article", func(t *testing.T) {
		var got map[string]types.AttributeValue
		repo := newArticleRepository(fakeDynamo{putCheck: func(input *dynamodb.PutItemInput) { got = input.Item }})
		if err := repo.SaveArticle(context.Background(), want); err != nil {
			t.Fatal(err)
		}
		var gotArticle model.Article
		if err := attributevalue.UnmarshalMap(got, &gotArticle); err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(gotArticle, want) {
			t.Errorf("article = %+v, want %+v", gotArticle, want)
		}
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		err := newArticleRepository(fakeDynamo{putErr: errors.New("dependency down")}).SaveArticle(context.Background(), want)
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}

/*
 ******************************************************************************
 * DeleteArticle
 * - 指定したArticleを正常に削除すること
 * - DynamoDBエラーをDependencyUnavailableへ変換すること
 ******************************************************************************
 */
func TestArticleRepositoryDeleteArticle(t *testing.T) {
	t.Run("successfully deletes an article", func(t *testing.T) {
		if err := newArticleRepository(fakeDynamo{}).DeleteArticle(context.Background(), "a1"); err != nil {
			t.Fatal(err)
		}
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		err := newArticleRepository(fakeDynamo{deleteErr: errors.New("dependency down")}).DeleteArticle(context.Background(), "a1")
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}
