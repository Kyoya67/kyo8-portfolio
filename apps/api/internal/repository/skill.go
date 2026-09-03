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

const defaultSkillTable = "skill-stg"

type SkillRepository struct {
	db        *dynamodb.Client
	tableName string
}

type skillItem struct {
	ID     string        `dynamodbav:"id"`
	Skills []model.Skill `dynamodbav:"skills"`
}

func NewSkillRepository(db *dynamodb.Client) *SkillRepository {
	tableName := os.Getenv("SKILL_TABLE_NAME")
	if tableName == "" {
		tableName = defaultSkillTable
	}

	return &SkillRepository{db: db, tableName: tableName}
}

func (r *SkillRepository) GetSkills(ctx context.Context) ([]model.Skill, error) {
	output, err := r.db.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: "skills"},
		},
	})
	if err != nil {
		return nil, classifyDynamoError(err)
	}
	if len(output.Item) == 0 {
		return []model.Skill{}, nil
	}

	var item skillItem
	if err := attributevalue.UnmarshalMap(output.Item, &item); err != nil {
		return nil, apperrors.DataMappingFailed.Wrap(err, "failed to decode skills data")
	}
	return item.Skills, nil
}

func (r *SkillRepository) UpdateSkills(ctx context.Context, skills []model.Skill) error {
	item, err := attributevalue.MarshalMap(skillItem{ID: "skills", Skills: skills})
	if err != nil {
		return apperrors.DataMappingFailed.Wrap(err, "failed to encode skills data")
	}

	_, err = r.db.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(r.tableName),
		Item:      item,
	})
	if err != nil {
		return classifyDynamoError(err)
	}
	return nil
}
