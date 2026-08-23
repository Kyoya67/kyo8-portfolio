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

const defaultCareerTable = "career-stg"

type CareerRepository struct {
	db        *dynamodb.Client
	tableName string
}

func NewCareerRepository(db *dynamodb.Client) *CareerRepository {
	tableName := os.Getenv("CAREER_TABLE_NAME")
	if tableName == "" {
		tableName = defaultCareerTable
	}
	return &CareerRepository{db: db, tableName: tableName}
}

func (r *CareerRepository) ListCareers(ctx context.Context) ([]model.Career, error) {
	output, err := r.db.Scan(ctx, &dynamodb.ScanInput{TableName: aws.String(r.tableName)})
	if err != nil {
		return nil, fmt.Errorf("list careers from DynamoDB: %w", err)
	}

	careers := make([]model.Career, 0, len(output.Items))
	if err := attributevalue.UnmarshalListOfMaps(output.Items, &careers); err != nil {
		return nil, fmt.Errorf("unmarshal careers: %w", err)
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
		return model.Career{}, fmt.Errorf("get career from DynamoDB: %w", err)
	}
	if len(output.Item) == 0 {
		return model.Career{}, fmt.Errorf("career not found")
	}

	var career model.Career
	if err := attributevalue.UnmarshalMap(output.Item, &career); err != nil {
		return model.Career{}, fmt.Errorf("unmarshal career: %w", err)
	}
	return career, nil
}

func (r *CareerRepository) SaveCareer(ctx context.Context, career model.Career) error {
	item, err := attributevalue.MarshalMap(career)
	if err != nil {
		return fmt.Errorf("marshal career: %w", err)
	}
	_, err = r.db.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(r.tableName), Item: item})
	if err != nil {
		return fmt.Errorf("save career to DynamoDB: %w", err)
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
		return fmt.Errorf("delete career from DynamoDB: %w", err)
	}
	return nil
}
