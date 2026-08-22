package service

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

type ProfileService struct {
	db        *dynamodb.Client
	tableName string
}

func NewProfileService(config aws.Config) *ProfileService {
	tableName := os.Getenv("PROFILE_TABLE_NAME")
	if tableName == "" {
		tableName = defaultProfileTable
	}

	return &ProfileService{
		db:        dynamodb.NewFromConfig(config),
		tableName: tableName,
	}
}

func (s *ProfileService) GetProfile(ctx context.Context) (model.Profile, error) {
	output, err := s.db.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(s.tableName),
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
