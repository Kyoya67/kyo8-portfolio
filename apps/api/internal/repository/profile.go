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

type ProfileRepository struct {
	db        dynamoAPI
	tableName string
}

func NewProfileRepository(db dynamoAPI, tableName string) *ProfileRepository {
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
		return model.Profile{}, classifyDynamoError(err)
	}

	if len(output.Item) == 0 {
		return model.Profile{}, apperrors.NotFound.Wrap(errDynamoDataNotFound, "profile not found")
	}

	var profile model.Profile
	if err := attributevalue.UnmarshalMap(output.Item, &profile); err != nil {
		return model.Profile{}, apperrors.DataMappingFailed.Wrap(err, "failed to decode profile data")
	}

	return profile, nil
}

func (r *ProfileRepository) UpdateProfile(ctx context.Context, profile model.Profile) error {
	item, err := attributevalue.MarshalMap(profile)
	if err != nil {
		return apperrors.DataMappingFailed.Wrap(err, "failed to encode profile data")
	}

	item["id"] = &types.AttributeValueMemberS{Value: "profile"}

	_, err = r.db.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(r.tableName),
		Item:      item,
	})
	if err != nil {
		return classifyDynamoError(err)
	}

	return nil
}
