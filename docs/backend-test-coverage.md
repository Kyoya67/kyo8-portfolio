# Backendテストカバレッジ

## テストの書き方

- 本番コードのHandler関数ごとにテスト関数を分ける
- テスト関数名は`Test{Handler名}{関数名}`とする
- 各テスト関数の前に、対象関数・引数・URLパラメータ・リクエストボディ・検証内容をコメントで記載する
- サブテストは原則として、`success`、入力エラー、Serviceエラーの順番で記述する
- 成功ケースでは、処理結果と期待するHTTPステータスを検証する
- 入力エラーでは、不正なJSONや必須パラメータ不足を実際のリクエストで再現する
- Serviceエラーでは、Fakeにエラーを設定してHandlerのエラーレスポンスを検証する
- Handlerの依存先はFakeに差し替え、DynamoDBなどの外部サービスへ接続しない
- エラーの検証には共通ヘルパーを使い、HTTPステータス・エラーコード・メッセージをまとめて確認する
- 複数のテストファイルで使うヘルパーは`test_helpers_test.go`にまとめる
- 特定のHandlerだけで使うヘルパーは、そのHandlerの`_test.go`に定義する

コメントの例：

`````go
/*
 ******************************************************************************
 * CreateArticle
 * - 正常なJSONを受け取った場合に、記事を保存し、204を返すこと
 * - JSON形式が不正な場合に、ReqBodyDecodeFailed / 400を返すこと
 * - Serviceでエラーが発生した場合に、DependencyUnavailable / 503を返すこと
 ******************************************************************************
 */
`````

エラーケースの例：

`````go
assertSharedError(
    t,
    w,
    http.StatusBadRequest,
    apperrors.ReqBodyDecodeFailed,
    "Failed to decode request body",
)
`````

テスト用のHandler呼び出しでは、`w`をレスポンス、`req`をリクエストとして変数名を分ける。

`````go
w := httptest.NewRecorder()
h := NewArticleHandler(articleServiceFake{}, zennServiceFake{})
req := httptest.NewRequest(http.MethodGet, "/articles", nil)

h.ListArticles(w, req)
`````

## カバレッジ結果

2026-09-05時点。Profileのテストだけを実行し、`profile.go`の関数単位で確認した結果。

| 対象ファイル | 関数 | カバレッジ |
|---|---|---:|
| `profile.go` | `NewProfileHandler` | 100.0% |
| `profile.go` | `GetProfile` | 100.0% |
| `profile.go` | `UpdateProfile` | 100.0% |
| `skill.go` | `NewSkillHandler` | 100.0% |
| `skill.go` | `GetSkills` | 100.0% |
| `skill.go` | `UpdateSkills` | 100.0% |
| `project.go` | `NewProjectHandler` | 100.0% |
| `project.go` | `ListProjects` | 100.0% |
| `project.go` | `GetProject` | 100.0% |
| `project.go` | `CreateProject` | 100.0% |
| `project.go` | `UpdateProject` | 100.0% |
| `project.go` | `DeleteProject` | 100.0% |

Profileテストの実行例：

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestProfileHandler' -coverprofile=/private/tmp/profile-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/profile-cover.out | grep 'profile.go'
`````

Skillテストの実行例：

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestSkillHandler' -coverprofile=/private/tmp/skill-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/skill-cover.out | grep 'skill.go'
`````

Projectテストの実行例：

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestProjectHandler' -coverprofile=/private/tmp/project-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/project-cover.out | grep 'project.go'
`````
