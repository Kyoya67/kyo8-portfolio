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
 * Test Model
 * - Get・List・Saveで共通して使用するCareerデータを定義すること
 ******************************************************************************
 */

func testCareers() []model.Career {
	endDate1 := "2026-03"
	endDate2 := "2025-12"
	return []model.Career{{
		ID:           "c1",
		Type:         "work",
		Organization: "Company A",
		Position:     model.LocalizedText{EN: "Engineer", JA: "エンジニア"},
		StartDate:    "2024-04",
		EndDate:      &endDate1,
		Description:  model.LocalizedText{EN: "Backend development", JA: "バックエンド開発"},
		Order:        1,
	}, {
		ID:           "c2",
		Type:         "education",
		Organization: "University B",
		Position:     model.LocalizedText{EN: "Student", JA: "学生"},
		StartDate:    "2020-04",
		EndDate:      &endDate2,
		Description:  model.LocalizedText{EN: "Computer science", JA: "情報科学"},
		Order:        2,
	}}
}

/*
 ******************************************************************************
 * ListCareers
 * - 複数のCareerを取得して全フィールドをモデルへ変換すること
 * - 0件の場合にNotFoundを返すこと
 * - データ変換エラーとDynamoDBエラーを分類すること
 ******************************************************************************
 */
func TestCareerRepositoryListCareers(t *testing.T) {
	want := testCareers()
	item1, err := attributevalue.MarshalMap(want[0])
	if err != nil {
		t.Fatal(err)
	}
	item2, err := attributevalue.MarshalMap(want[1])
	if err != nil {
		t.Fatal(err)
	}
	t.Run("successfully lists and decodes careers", func(t *testing.T) {
		repo := NewCareerRepository(
			fakeDynamo{scanOutput: &dynamodb.ScanOutput{Items: []map[string]types.AttributeValue{item1, item2}}},
			"careers",
		)
		got, err := repo.ListCareers(context.Background())
		if err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("careers = %+v, want %+v", got, want)
		}
	})
	t.Run("returns NotFound when no careers exist", func(t *testing.T) {
		repo := NewCareerRepository(
			fakeDynamo{scanOutput: &dynamodb.ScanOutput{}},
			"careers",
		)
		_, err := repo.ListCareers(context.Background())
		assertRepositoryError(t, err, apperrors.NotFound)
	})
	t.Run("classifies invalid data as DataMappingFailed", func(t *testing.T) {
		repo := NewCareerRepository(
			fakeDynamo{scanOutput: &dynamodb.ScanOutput{Items: []map[string]types.AttributeValue{{"position": &types.AttributeValueMemberS{Value: "invalid"}}}}},
			"careers",
		)
		_, err := repo.ListCareers(context.Background())
		assertRepositoryError(t, err, apperrors.DataMappingFailed)
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		repo := NewCareerRepository(
			fakeDynamo{err: errors.New("dependency down")},
			"careers",
		)
		_, err := repo.ListCareers(context.Background())
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}

/*
 ******************************************************************************
 * GetCareer
 * - 指定したCareerを取得して全フィールドをモデルへ変換すること
 * - データ未存在、データ変換エラー、DynamoDBエラーを分類すること
 ******************************************************************************
 */
func TestCareerRepositoryGetCareer(t *testing.T) {
	want := testCareers()[0]
	item, err := attributevalue.MarshalMap(want)
	if err != nil {
		t.Fatal(err)
	}
	t.Run("successfully gets and decodes a career", func(t *testing.T) {
		repo := NewCareerRepository(
			fakeDynamo{getOutput: &dynamodb.GetItemOutput{Item: item}},
			"careers",
		)
		got, err := repo.GetCareer(context.Background(), "c1")
		if err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("career = %+v, want %+v", got, want)
		}
	})
	t.Run("returns NotFound when career does not exist", func(t *testing.T) {
		repo := NewCareerRepository(
			fakeDynamo{getOutput: &dynamodb.GetItemOutput{}},
			"careers",
		)
		_, err := repo.GetCareer(context.Background(), "c1")
		assertRepositoryError(t, err, apperrors.NotFound)
	})
	t.Run("classifies invalid data as DataMappingFailed", func(t *testing.T) {
		repo := NewCareerRepository(
			fakeDynamo{getOutput: &dynamodb.GetItemOutput{Item: map[string]types.AttributeValue{"position": &types.AttributeValueMemberS{Value: "invalid"}}}},
			"careers",
		)
		_, err := repo.GetCareer(context.Background(), "c1")
		assertRepositoryError(t, err, apperrors.DataMappingFailed)
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		repo := NewCareerRepository(
			fakeDynamo{err: errors.New("dependency down")},
			"careers",
		)
		_, err := repo.GetCareer(context.Background(), "c1")
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}

/*
 ******************************************************************************
 * SaveCareer
 * - 正常なCareerを保存し、保存内容の全フィールドを検証すること
 * - DynamoDBエラーをDependencyUnavailableへ変換すること
 ******************************************************************************
 */
func TestCareerRepositorySaveCareer(t *testing.T) {
	want := testCareers()[0]
	t.Run("successfully saves a career", func(t *testing.T) {
		var got map[string]types.AttributeValue
		repo := NewCareerRepository(
			fakeDynamo{putCheck: func(input *dynamodb.PutItemInput) { got = input.Item }},
			"careers",
		)
		if err := repo.SaveCareer(context.Background(), want); err != nil {
			t.Fatal(err)
		}
		var gotCareer model.Career
		if err := attributevalue.UnmarshalMap(got, &gotCareer); err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(gotCareer, want) {
			t.Errorf("career = %+v, want %+v", gotCareer, want)
		}
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		err := NewCareerRepository(
			fakeDynamo{putErr: errors.New("dependency down")},
			"careers",
		).SaveCareer(context.Background(), want)
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}

/*
 ******************************************************************************
 * DeleteCareer
 * - 指定したCareerを正常に削除すること
 * - DynamoDBエラーをDependencyUnavailableへ変換すること
 ******************************************************************************
 */
func TestCareerRepositoryDeleteCareer(t *testing.T) {
	t.Run("successfully deletes a career", func(t *testing.T) {
		if err := NewCareerRepository(
			fakeDynamo{},
			"careers",
		).DeleteCareer(context.Background(), "c1"); err != nil {
			t.Fatal(err)
		}
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		err := NewCareerRepository(
			fakeDynamo{deleteErr: errors.New("dependency down")},
			"careers",
		).DeleteCareer(context.Background(), "c1")
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}
