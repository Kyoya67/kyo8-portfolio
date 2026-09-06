package repository

import (
	"context"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type ArticleRepository struct {
	db        dynamoAPI
	tableName string
}

func NewArticleRepository(db dynamoAPI, tableName string) *ArticleRepository {
	return &ArticleRepository{db: db, tableName: tableName}
}

func (r *ArticleRepository) GetArticle(ctx context.Context, id string) (model.Article, error) {
	output, err := r.db.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
	})
	if err != nil {
		return model.Article{}, classifyDynamoError(err)
	}
	if len(output.Item) == 0 {
		return model.Article{}, apperrors.NotFound.Wrap(errDynamoDataNotFound, "article not found")
	}

	var article model.Article
	if err := attributevalue.UnmarshalMap(output.Item, &article); err != nil {
		return model.Article{}, apperrors.DataMappingFailed.Wrap(err, "failed to decode article data")
	}
	return article, nil
}

func (r *ArticleRepository) ListArticles(ctx context.Context) ([]model.Article, error) {
	input := &dynamodb.ScanInput{TableName: aws.String(r.tableName)}

	output, err := r.db.Scan(ctx, input)
	if err != nil {
		return nil, classifyDynamoError(err)
	}
	if len(output.Items) == 0 {
		return nil, apperrors.NotFound.Wrap(errDynamoDataNotFound, "articles not found")
	}

	articles := make([]model.Article, 0, len(output.Items))
	if err := attributevalue.UnmarshalListOfMaps(output.Items, &articles); err != nil {
		return nil, apperrors.DataMappingFailed.Wrap(err, "failed to decode articles data")
	}
	return articles, nil
}

func (r *ArticleRepository) SaveArticle(ctx context.Context, article model.Article) error {
	item, err := attributevalue.MarshalMap(article)
	if err != nil {
		return apperrors.DataMappingFailed.Wrap(err, "failed to encode article data")
	}
	_, err = r.db.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(r.tableName), Item: item})
	if err != nil {
		return classifyDynamoError(err)
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
		return classifyDynamoError(err)
	}
	return nil
}
