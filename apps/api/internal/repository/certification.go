package repository

import (
	"context"
	"sort"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type CertificationRepository struct {
	db        dynamoAPI
	tableName string
}

func NewCertificationRepository(db dynamoAPI, tableName string) *CertificationRepository {
	return &CertificationRepository{db: db, tableName: tableName}
}

func (r *CertificationRepository) ListCertifications(ctx context.Context) ([]model.Certification, error) {
	certifications := make([]model.Certification, 0)
	input := &dynamodb.ScanInput{TableName: aws.String(r.tableName), ConsistentRead: aws.Bool(true)}
	for {
		output, err := r.db.Scan(ctx, input)
		if err != nil {
			return nil, classifyDynamoError(err)
		}
		var page []model.Certification
		if err := attributevalue.UnmarshalListOfMaps(output.Items, &page); err != nil {
			return nil, apperrors.DataMappingFailed.Wrap(err, "failed to decode certifications data")
		}
		certifications = append(certifications, page...)
		if len(output.LastEvaluatedKey) == 0 {
			break
		}
		input.ExclusiveStartKey = output.LastEvaluatedKey
	}
	sort.Slice(certifications, func(i, j int) bool {
		if certifications[i].Order == certifications[j].Order {
			return certifications[i].ID < certifications[j].ID
		}
		return certifications[i].Order < certifications[j].Order
	})
	return certifications, nil
}

func (r *CertificationRepository) SaveCertification(ctx context.Context, certification model.Certification) error {
	item, err := attributevalue.MarshalMap(certification)
	if err != nil {
		return apperrors.DataMappingFailed.Wrap(err, "failed to encode certification data")
	}
	_, err = r.db.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(r.tableName), Item: item})
	if err != nil {
		return classifyDynamoError(err)
	}
	return nil
}

func (r *CertificationRepository) DeleteCertification(ctx context.Context, id string) error {
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
