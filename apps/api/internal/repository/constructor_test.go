package repository

import "testing"

/*
 ******************************************************************************
 * Repository constructors
 * - 渡したDynamoDBクライアントとテーブル名をRepositoryへ設定すること
 ******************************************************************************
 */
func TestRepositoryConstructors(t *testing.T) {
	t.Run("creates article repository with table name", func(t *testing.T) {
		repo := NewArticleRepository(fakeDynamo{}, "custom-article")
		if repo.tableName != "custom-article" {
			t.Errorf("table name = %q, want %q", repo.tableName, "custom-article")
		}
	})

	t.Run("creates career repository with table name", func(t *testing.T) {
		repo := NewCareerRepository(fakeDynamo{}, "custom-career")
		if repo.tableName != "custom-career" {
			t.Errorf("table name = %q, want %q", repo.tableName, "custom-career")
		}
	})

	t.Run("creates profile repository with table name", func(t *testing.T) {
		repo := NewProfileRepository(fakeDynamo{}, "custom-profile")
		if repo.tableName != "custom-profile" {
			t.Errorf("table name = %q, want %q", repo.tableName, "custom-profile")
		}
	})

	t.Run("creates project repository with table name", func(t *testing.T) {
		repo := NewProjectRepository(fakeDynamo{}, "custom-project")
		if repo.tableName != "custom-project" {
			t.Errorf("table name = %q, want %q", repo.tableName, "custom-project")
		}
	})

	t.Run("creates skill repository with table name", func(t *testing.T) {
		repo := NewSkillRepository(fakeDynamo{}, "custom-skill")
		if repo.tableName != "custom-skill" {
			t.Errorf("table name = %q, want %q", repo.tableName, "custom-skill")
		}
	})
}
