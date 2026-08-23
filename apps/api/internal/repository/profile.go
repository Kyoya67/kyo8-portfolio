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

const defaultProfileTable = "profile-stg"

type ProfileRepository struct {
	db        *dynamodb.Client
	tableName string
}

func NewProfileRepository(db *dynamodb.Client) *ProfileRepository {
	tableName := os.Getenv("PROFILE_TABLE_NAME")
	if tableName == "" {
		tableName = defaultProfileTable
	}

	return &ProfileRepository{
		db:        db,
		tableName: tableName,
	}
}

func (r *ProfileRepository) GetProfile(ctx context.Context) (model.Profile, error) {
	output, err := r.db.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: "profile"},
		},
	})
	if err != nil {
		return model.Profile{}, fmt.Errorf("get profile from DynamoDB: %w", err)
	}

	if len(output.Item) == 0 {
		return model.Profile{}, fmt.Errorf("profile not found")
	}

	var profile model.Profile
	if err := attributevalue.UnmarshalMap(output.Item, &profile); err != nil {
		return model.Profile{}, fmt.Errorf("unmarshal profile: %w", err)
	}

	return profile, nil
}

func (r *ProfileRepository) SaveProfile(ctx context.Context, profile model.Profile) error {
	item, err := attributevalue.MarshalMap(profile)
	if err != nil {
		return fmt.Errorf("marshal profile: %w", err)
	}

	item["id"] = &types.AttributeValueMemberS{Value: "profile"}

	_, err = r.db.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(r.tableName),
		Item:      item,
	})
	if err != nil {
		return fmt.Errorf("save profile to DynamoDB: %w", err)
	}

	return nil
}
