# APIテスト

## 目次

- [Handlerテスト](#handlerテスト)
  - [書き方](#handlerテストの書き方)
  - [カバレッジ結果](#handlerテストのカバレッジ結果)
- [Repositoryテスト](#repositoryテスト)
  - [書き方](#repositoryテストの書き方)
  - [カバレッジ結果](#repositoryテストのカバレッジ結果)
  
## Handlerテスト

### Handlerテストの書き方

- 本番コードのHandler関数ごとに`Test{Handler名}{関数名}`としてテストを分ける
- 各テスト関数の前に、対象関数・引数・URLパラメータ・リクエストボディ・検証内容をコメントで記載する
- サブテストは`success`、入力エラー、Serviceエラーの順番で記述する
- 成功時は処理結果とHTTPステータスを検証する
- 入力エラーは不正なJSONや必須パラメータ不足を実際のRequestで再現する
- ServiceエラーはFakeにエラーを設定し、HTTPステータス・エラーコード・メッセージを共通ヘルパーで検証する
- Handlerの依存先はFakeに差し替え、外部サービスへ接続しない
- 複数のテストで使うヘルパーは`test_helpers_test.go`にまとめる
- Handler固有のヘルパーは対象の`_test.go`に定義する

### Handlerテストのカバレッジ結果

### Profile

| 関数 | カバレッジ |
|---|---:|
| `NewProfileHandler` | 100.0% |
| `GetProfile` | 100.0% |
| `UpdateProfile` | 100.0% |

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestProfileHandler' -coverprofile=/private/tmp/profile-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/profile-cover.out | grep 'profile.go'
`````

### Skill

| 関数 | カバレッジ |
|---|---:|
| `NewSkillHandler` | 100.0% |
| `GetSkills` | 100.0% |
| `UpdateSkills` | 100.0% |

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestSkillHandler' -coverprofile=/private/tmp/skill-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/skill-cover.out | grep 'skill.go'
`````

### Project

| 関数 | カバレッジ |
|---|---:|
| `NewProjectHandler` | 100.0% |
| `ListProjects` | 100.0% |
| `GetProject` | 100.0% |
| `CreateProject` | 100.0% |
| `UpdateProject` | 100.0% |
| `DeleteProject` | 100.0% |

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestProjectHandler' -coverprofile=/private/tmp/project-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/project-cover.out | grep 'project.go'
`````

### Article

| 関数 | カバレッジ |
|---|---:|
| `NewArticleHandler` | 100.0% |
| `ListArticles` | 100.0% |
| `GetArticle` | 100.0% |
| `CreateArticle` | 100.0% |
| `UpdateArticle` | 100.0% |
| `DeleteArticle` | 100.0% |
| `SyncZennArticles` | 100.0% |

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestArticleHandler' -coverprofile=/private/tmp/article-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/article-cover.out | grep 'article.go'
`````

### Career

| 関数 | カバレッジ |
|---|---:|
| `NewCareerHandler` | 100.0% |
| `ListCareers` | 100.0% |
| `CreateCareer` | 100.0% |
| `UpdateCareer` | 100.0% |
| `DeleteCareer` | 100.0% |

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestCareerHandler' -coverprofile=/private/tmp/career-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/career-cover.out | grep 'career.go'
`````

### 共通処理

| 関数 | カバレッジ |
|---|---:|
| `Health` | 100.0% |
| `decodeJSONBody` | 100.0% |
| `writeJSON` | 100.0% |

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestHealth$' -coverprofile=/private/tmp/health-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestDecodeJSONBody$' -coverprofile=/private/tmp/decode-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestWriteJSON' -coverprofile=/private/tmp/response-cover.out
`````

### Handler全体

Handlerパッケージ全体のカバレッジは`100.0%`。

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -coverprofile=/private/tmp/handler-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/handler-cover.out
`````

## Repositoryテスト

### Repositoryテストの書き方

Repositoryも本番コードのメソッドごとにテスト関数を分ける。各テスト関数の中では、成功、データ未存在・変換エラー、DynamoDBエラーの順で`t.Run`を記述する。DynamoDBクライアントは`fakeDynamo`へ差し替え、実際のAWSには接続しない。テストの冒頭には、対象メソッドと検証する観点をコメントで残している。

### Repositoryテストのカバレッジ結果

#### ProfileRepository

| 関数 | カバレッジ |
|---|---:|
| `NewProfileRepository` | 100.0% |
| `GetProfile` | 100.0% |
| `UpdateProfile` | 87.5% |

`UpdateProfile`の引数は`model.Profile`型で、各フィールドもDynamoDBへ変換できる型のため、`attributevalue.MarshalMap`は基本的に失敗しない。そのため変換失敗は未実行だが、DynamoDBへの保存成功・失敗は検証している。

`````bash
cd apps/api
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/repository -run '^TestProfileRepository' -coverprofile=/private/tmp/profile-repository-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/profile-repository-cover.out | grep 'profile.go'
`````

Repository全体のカバレッジは`96.9%`。

#### Repository全体

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/repository -coverprofile=/private/tmp/repository-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/repository-cover.out
`````
