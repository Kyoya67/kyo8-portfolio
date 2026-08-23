package repository

import (
	"context"
	"fmt"
	"os"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const defaultArticleTable = "article-stg"

type ArticleRepository struct {
	db        *dynamodb.Client
	tableName string
}

func NewArticleRepository(db *dynamodb.Client) *ArticleRepository {
	tableName := os.Getenv("ARTICLE_TABLE_NAME")
	if tableName == "" {
		tableName = defaultArticleTable
	}
	return &ArticleRepository{db: db, tableName: tableName}
}

func (r *ArticleRepository) ListArticles(ctx context.Context, publishedOnly bool) ([]model.Article, error) {
	input := &dynamodb.ScanInput{TableName: aws.String(r.tableName)}
	if publishedOnly {
		input.FilterExpression = aws.String("published = :published")
		input.ExpressionAttributeValues = map[string]types.AttributeValue{
			":published": &types.AttributeValueMemberBOOL{Value: true},
		}
	}

	output, err := r.db.Scan(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("list articles from DynamoDB: %w", err)
	}

	articles := make([]model.Article, 0, len(output.Items))
	if err := attributevalue.UnmarshalListOfMaps(output.Items, &articles); err != nil {
		return nil, fmt.Errorf("unmarshal articles: %w", err)
	}
	return articles, nil
}

func (r *ArticleRepository) GetArticle(ctx context.Context, id string) (model.Article, error) {
	output, err := r.db.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
	})
	if err != nil {
		return model.Article{}, fmt.Errorf("get article from DynamoDB: %w", err)
	}
	if len(output.Item) == 0 {
		return model.Article{}, fmt.Errorf("article not found")
	}

	var article model.Article
	if err := attributevalue.UnmarshalMap(output.Item, &article); err != nil {
		return model.Article{}, fmt.Errorf("unmarshal article: %w", err)
	}
	return article, nil
}

func (r *ArticleRepository) SaveArticle(ctx context.Context, article model.Article) error {
	item, err := attributevalue.MarshalMap(article)
	if err != nil {
		return fmt.Errorf("marshal article: %w", err)
	}
	_, err = r.db.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(r.tableName), Item: item})
	if err != nil {
		return fmt.Errorf("save article to DynamoDB: %w", err)
	}
	return nil
}

func (r *ArticleRepository) DeleteArticle(ctx context.Context, id string) error {
	_, err := r.db.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
	})
	if err != nil {
		return fmt.Errorf("delete article from DynamoDB: %w", err)
	}
	return nil
}
