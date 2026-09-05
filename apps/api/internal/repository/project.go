package repository

import (
	"context"
	"os"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const defaultProjectTable = "project-stg"

type ProjectRepository struct {
	db        *dynamodb.Client
	tableName string
}

func NewProjectRepository(db *dynamodb.Client) *ProjectRepository {
	tableName := os.Getenv("PROJECT_TABLE_NAME")
	if tableName == "" {
		tableName = defaultProjectTable
	}
	return &ProjectRepository{db: db, tableName: tableName}
}

func (r *ProjectRepository) ListProjects(ctx context.Context) ([]model.Project, error) {
	input := &dynamodb.ScanInput{TableName: aws.String(r.tableName)}

	output, err := r.db.Scan(ctx, input)
	if err != nil {
		return nil, classifyDynamoError(err)
	}

	projects := make([]model.Project, 0, len(output.Items))
	if err := attributevalue.UnmarshalListOfMaps(output.Items, &projects); err != nil {
		return nil, apperrors.DataMappingFailed.Wrap(err, "failed to decode projects data")
	}
	return projects, nil
}

func (r *ProjectRepository) GetProject(ctx context.Context, id string) (model.Project, error) {
	output, err := r.db.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
	})
	if err != nil {
		return model.Project{}, classifyDynamoError(err)
	}
	if len(output.Item) == 0 {
		return model.Project{}, apperrors.NotFound.Wrap(errDynamoDataNotFound, "project not found")
	}

	var project model.Project
	if err := attributevalue.UnmarshalMap(output.Item, &project); err != nil {
		return model.Project{}, apperrors.DataMappingFailed.Wrap(err, "failed to decode project data")
	}
	return project, nil
}

func (r *ProjectRepository) SaveProject(ctx context.Context, project model.Project) error {
	item, err := attributevalue.MarshalMap(project)
	if err != nil {
		return apperrors.DataMappingFailed.Wrap(err, "failed to encode project data")
	}
	_, err = r.db.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(r.tableName), Item: item})
	if err != nil {
		return classifyDynamoError(err)
	}
	return nil
}

func (r *ProjectRepository) DeleteProject(ctx context.Context, id string) error {
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
