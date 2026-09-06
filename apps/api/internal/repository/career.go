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

type CareerRepository struct {
	db        dynamoAPI
	tableName string
}

func NewCareerRepository(db dynamoAPI, tableName string) *CareerRepository {
	return &CareerRepository{db: db, tableName: tableName}
}

func (r *CareerRepository) ListCareers(ctx context.Context) ([]model.Career, error) {
	output, err := r.db.Scan(ctx, &dynamodb.ScanInput{TableName: aws.String(r.tableName)})
	if err != nil {
		return nil, classifyDynamoError(err)
	}
	if len(output.Items) == 0 {
		return nil, apperrors.NotFound.Wrap(errDynamoDataNotFound, "careers not found")
	}

	careers := make([]model.Career, 0, len(output.Items))
	if err := attributevalue.UnmarshalListOfMaps(output.Items, &careers); err != nil {
		return nil, apperrors.DataMappingFailed.Wrap(err, "failed to decode careers data")
	}
	return careers, nil
}

func (r *CareerRepository) GetCareer(ctx context.Context, id string) (model.Career, error) {
	output, err := r.db.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
	})
	if err != nil {
		return model.Career{}, classifyDynamoError(err)
	}
	if len(output.Item) == 0 {
		return model.Career{}, apperrors.NotFound.Wrap(errDynamoDataNotFound, "career not found")
	}

	var career model.Career
	if err := attributevalue.UnmarshalMap(output.Item, &career); err != nil {
		return model.Career{}, apperrors.DataMappingFailed.Wrap(err, "failed to decode career data")
	}
	return career, nil
}

func (r *CareerRepository) SaveCareer(ctx context.Context, career model.Career) error {
	item, err := attributevalue.MarshalMap(career)
	if err != nil {
		return apperrors.DataMappingFailed.Wrap(err, "failed to encode career data")
	}
	_, err = r.db.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(r.tableName), Item: item})
	if err != nil {
		return classifyDynamoError(err)
	}
	return nil
}

func (r *CareerRepository) DeleteCareer(ctx context.Context, id string) error {
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
