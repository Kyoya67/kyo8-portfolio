package repository

import (
	"context"
	"errors"
	"reflect"
	"testing"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/model"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

/*
 ******************************************************************************
 * GetProfile
 * - 正常なプロフィールを取得してモデルへ変換すること
 * - DynamoDBエラー、データ未存在、データ変換エラーを分類すること
 ******************************************************************************
 */
func TestProfileRepositoryGetProfile(t *testing.T) {
	ctx := context.Background()
	linkedinURL := "https://linkedin.com/in/kyoya"
	profile := model.Profile{
		Name:        "Kyoya",
		Handle:      "kyoya",
		Headline:    model.LocalizedText{EN: "Engineer", JA: "エンジニア"},
		Bio:         model.LocalizedText{EN: "Backend developer", JA: "バックエンド開発者"},
		Location:    model.LocalizedText{EN: "Tokyo", JA: "東京"},
		Focus:       []string{"Go", "AWS"},
		GitHubURL:   "https://github.com/Kyoya67",
		LinkedInURL: &linkedinURL,
	}
	item, err := attributevalue.MarshalMap(profile)
	if err != nil {
		t.Fatal(err)
	}

	t.Run("successfully gets and decodes profile", func(t *testing.T) {
		repo := NewProfileRepository(fakeDynamo{getOutput: &dynamodb.GetItemOutput{Item: item}}, "profiles")
		got, err := repo.GetProfile(ctx)
		if err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(got, profile) {
			t.Errorf("profile = %+v, want %+v", got, profile)
		}
	})

	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		repo := NewProfileRepository(fakeDynamo{err: errors.New("dependency down")}, "profiles")
		_, err := repo.GetProfile(ctx)
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})

	t.Run("returns NotFound when profile does not exist", func(t *testing.T) {
		repo := NewProfileRepository(fakeDynamo{getOutput: &dynamodb.GetItemOutput{}}, "profiles")
		_, err := repo.GetProfile(ctx)
		assertRepositoryError(t, err, apperrors.NotFound)
	})

	t.Run("classifies invalid data as DataMappingFailed", func(t *testing.T) {
		repo := NewProfileRepository(fakeDynamo{getOutput: &dynamodb.GetItemOutput{
			Item: map[string]types.AttributeValue{
				"headline": &types.AttributeValueMemberS{Value: "invalid"},
			},
		}}, "profiles")
		_, err := repo.GetProfile(ctx)
		assertRepositoryError(t, err, apperrors.DataMappingFailed)
	})
}

/*
 ******************************************************************************
 * UpdateProfile
 * - 正常なプロフィールを保存すること
 * - DynamoDBエラーをDependencyUnavailableへ変換すること
 ******************************************************************************
 */
func TestProfileRepositoryUpdateProfile(t *testing.T) {
	profile := model.Profile{Name: "Kyoya"}

	t.Run("successfully updates profile", func(t *testing.T) {
		repo := NewProfileRepository(fakeDynamo{}, "profiles")
		if err := repo.UpdateProfile(context.Background(), profile); err != nil {
			t.Fatal(err)
		}
	})

	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		repo := NewProfileRepository(fakeDynamo{putErr: errors.New("dependency down")}, "profiles")
		err := repo.UpdateProfile(context.Background(), profile)
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}
