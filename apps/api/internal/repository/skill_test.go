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
******************************************************************************
*/

func testSkills() []model.Skill {
	return []model.Skill{{
		ID:           "go",
		Name:         "Go",
		Category:     "Backend",
		Order:        1,
		Capabilities: []string{"API", "Concurrency"},
		Children: []model.SkillChild{{
			ID:           "gin",
			Name:         "Gin",
			Capabilities: []string{"HTTP routing"},
		}},
	}}
}

/*
 ******************************************************************************
 * GetSkills
 * - 正常なスキル一覧を取得してモデルへ変換すること
 * - データが存在しない場合にNotFoundを返すこと
 * - データ変換エラーとDynamoDBエラーを分類すること
 ******************************************************************************
 */
func TestSkillRepositoryGetSkills(t *testing.T) {
	want := testSkills()
	item, err := attributevalue.MarshalMap(skillItem{
		ID:     "skills",
		Skills: want,
	})
	if err != nil {
		t.Fatal(err)
	}

	t.Run("successfully gets and decodes skills", func(t *testing.T) {
		repo := NewSkillRepository(fakeDynamo{
			getOutput: &dynamodb.GetItemOutput{Item: item},
		}, "skills")
		got, err := repo.GetSkills(context.Background())
		if err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("skills = %+v, want %+v", got, want)
		}
	})

	t.Run("returns NotFound when skills do not exist", func(t *testing.T) {
		repo := NewSkillRepository(fakeDynamo{
			getOutput: &dynamodb.GetItemOutput{},
		}, "skills")
		_, err := repo.GetSkills(context.Background())
		assertRepositoryError(t, err, apperrors.NotFound)
	})

	t.Run("classifies invalid data as DataMappingFailed", func(t *testing.T) {
		repo := NewSkillRepository(fakeDynamo{getOutput: &dynamodb.GetItemOutput{
			Item: map[string]types.AttributeValue{
				"skills": &types.AttributeValueMemberS{Value: "invalid"},
			},
		}}, "skills")
		_, err := repo.GetSkills(context.Background())
		assertRepositoryError(t, err, apperrors.DataMappingFailed)
	})

	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		repo := NewSkillRepository(fakeDynamo{err: errors.New("dependency down")}, "skills")
		_, err := repo.GetSkills(context.Background())
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}

/*
 ******************************************************************************
 * UpdateSkills
 * - 正常なスキル一覧を保存すること
 * - DynamoDBエラーをDependencyUnavailableへ変換すること
 ******************************************************************************
 */
func TestSkillRepositoryUpdateSkills(t *testing.T) {
	want := testSkills()
	t.Run("successfully updates skills", func(t *testing.T) {
		var got map[string]types.AttributeValue
		repo := NewSkillRepository(fakeDynamo{
			putCheck: func(input *dynamodb.PutItemInput) {
				got = input.Item
			},
		}, "skills")
		if err := repo.UpdateSkills(context.Background(), want); err != nil {
			t.Fatal(err)
		}
		var gotItem skillItem
		if err := attributevalue.UnmarshalMap(got, &gotItem); err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(gotItem.Skills, want) {
			t.Errorf("skills = %+v, want %+v", gotItem.Skills, want)
		}
	})

	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		repo := NewSkillRepository(fakeDynamo{putErr: errors.New("dependency down")}, "skills")
		err := repo.UpdateSkills(context.Background(), nil)
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}
