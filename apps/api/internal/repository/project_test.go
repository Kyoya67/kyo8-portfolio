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
 * Test Models
******************************************************************************
*/
func testProjects() []model.Project {
	websiteURL := "https://example.com"
	imageURL := "https://example.com/project.png"
	return []model.Project{{
		ID:            "p1",
		Slug:          "portfolio",
		Title:         model.LocalizedText{EN: "Portfolio", JA: "ポートフォリオ"},
		Summary:       model.LocalizedText{EN: "Summary", JA: "概要"},
		Description:   model.LocalizedText{EN: "Description", JA: "説明"},
		Graphic:       "graphic",
		RepositoryURL: "https://github.com/Kyoya/project",
		WebsiteURL:    &websiteURL, ImageURL: &imageURL,
		Technologies: []string{"Go", "AWS"}, Featured: true, Published: true, Order: 1, Year: "2026",
	}, {
		ID:            "p2",
		Slug:          "blog",
		Title:         model.LocalizedText{EN: "Blog", JA: "ブログ"},
		Summary:       model.LocalizedText{EN: "Blog summary", JA: "ブログ概要"},
		Description:   model.LocalizedText{EN: "Blog description", JA: "ブログ説明"},
		Graphic:       "blog-graphic",
		RepositoryURL: "https://github.com/Kyoya/blog", WebsiteURL: &websiteURL, ImageURL: &imageURL,
		Technologies: []string{"Next.js", "TypeScript"}, Featured: false, Published: true, Order: 2, Year: "2025",
	}}
}

/*
 ******************************************************************************
 * ListProjects
 * - 複数のProjectを取得して全フィールドをモデルへ変換すること
 * - DynamoDBエラーを分類すること、データ未存在、データ変換エラー
 ******************************************************************************
 */
func TestProjectRepositoryListProjects(t *testing.T) {
	want := testProjects()
	item1, err := attributevalue.MarshalMap(want[0])
	if err != nil {
		t.Fatal(err)
	}
	item2, err := attributevalue.MarshalMap(want[1])
	if err != nil {
		t.Fatal(err)
	}
	t.Run("successfully lists and decodes projects", func(t *testing.T) {
		repo := NewProjectRepository(
			fakeDynamo{scanOutput: &dynamodb.ScanOutput{Items: []map[string]types.AttributeValue{item1, item2}}},
			"projects",
		)
		got, err := repo.ListProjects(context.Background())
		if err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("projects = %+v, want %+v", got, want)
		}
	})
	t.Run("returns NotFound when no projects exist", func(t *testing.T) {
		repo := NewProjectRepository(
			fakeDynamo{scanOutput: &dynamodb.ScanOutput{}},
			"projects",
		)
		_, err := repo.ListProjects(context.Background())
		assertRepositoryError(t, err, apperrors.NotFound)
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		repo := NewProjectRepository(fakeDynamo{err: errors.New("dependency down")}, "projects")
		_, err := repo.ListProjects(context.Background())
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
	t.Run("classifies invalid data as DataMappingFailed", func(t *testing.T) {
		repo := NewProjectRepository(
			fakeDynamo{scanOutput: &dynamodb.ScanOutput{Items: []map[string]types.AttributeValue{{"title": &types.AttributeValueMemberS{Value: "invalid"}}}}},
			"projects",
		)
		_, err := repo.ListProjects(context.Background())
		assertRepositoryError(t, err, apperrors.DataMappingFailed)
	})
}

/*
 ******************************************************************************
 * GetProject
 * - 指定したProjectを取得して全フィールドをモデルへ変換すること
 * - DynamoDBエラーを分類すること、データ未存在、データ変換エラー
 ******************************************************************************
 */
func TestProjectRepositoryGetProject(t *testing.T) {
	want := testProjects()[0]
	item, err := attributevalue.MarshalMap(want)
	if err != nil {
		t.Fatal(err)
	}
	t.Run("successfully gets and decodes a project", func(t *testing.T) {
		repo := NewProjectRepository(
			fakeDynamo{getOutput: &dynamodb.GetItemOutput{Item: item}},
			"projects",
		)
		got, err := repo.GetProject(context.Background(), "p1")
		if err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("project = %+v, want %+v", got, want)
		}
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		repo := NewProjectRepository(fakeDynamo{err: errors.New("dependency down")}, "projects")
		_, err := repo.GetProject(context.Background(), "p1")
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
	t.Run("returns NotFound when project does not exist", func(t *testing.T) {
		repo := NewProjectRepository(fakeDynamo{getOutput: &dynamodb.GetItemOutput{}}, "projects")
		_, err := repo.GetProject(context.Background(), "p1")
		assertRepositoryError(t, err, apperrors.NotFound)
	})
	t.Run("classifies invalid data as DataMappingFailed", func(t *testing.T) {
		repo := NewProjectRepository(
			fakeDynamo{getOutput: &dynamodb.GetItemOutput{Item: map[string]types.AttributeValue{"title": &types.AttributeValueMemberS{Value: "invalid"}}}},
			"projects",
		)
		_, err := repo.GetProject(context.Background(), "p1")
		assertRepositoryError(t, err, apperrors.DataMappingFailed)
	})
}

/*
 ******************************************************************************
 * SaveProject
 * - 正常なProjectをDynamoDBへ保存し、保存内容の全フィールドを検証すること
 * - DynamoDBエラーをDependencyUnavailableへ変換すること
 ******************************************************************************
 */
func TestProjectRepositorySaveProject(t *testing.T) {
	want := testProjects()[0]
	t.Run("successfully saves a project", func(t *testing.T) {
		// DynamoDBへ保存されている内容を検証するために、putCheckを設定し、取得したItemをgotに格納する
		var got map[string]types.AttributeValue
		repo := NewProjectRepository(
			fakeDynamo{putCheck: func(input *dynamodb.PutItemInput) { got = input.Item }},
			"projects",
		)
		if err := repo.SaveProject(context.Background(), want); err != nil {
			t.Fatal(err)
		}
		var gotProject model.Project
		if err := attributevalue.UnmarshalMap(got, &gotProject); err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(gotProject, want) {
			t.Errorf("project = %+v, want %+v", gotProject, want)
		}
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		repo := NewProjectRepository(fakeDynamo{putErr: errors.New("dependency down")}, "projects")
		err := repo.SaveProject(context.Background(), want)
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}

/*
 ******************************************************************************
 * DeleteProject
 * - 指定したProjectを正常に削除すること
 * - DynamoDBエラーをDependencyUnavailableへ変換すること
 ******************************************************************************
 */
func TestProjectRepositoryDeleteProject(t *testing.T) {
	t.Run("successfully deletes a project", func(t *testing.T) {
		repo := NewProjectRepository(fakeDynamo{}, "projects")
		if err := repo.DeleteProject(context.Background(), "p1"); err != nil {
			t.Fatal(err)
		}
	})
	t.Run("classifies DynamoDB error as DependencyUnavailable", func(t *testing.T) {
		repo := NewProjectRepository(fakeDynamo{deleteErr: errors.New("dependency down")}, "projects")
		err := repo.DeleteProject(context.Background(), "p1")
		assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	})
}
