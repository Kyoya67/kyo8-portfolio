# APIテスト

## 目次

- [Handlerテスト](#handlerテスト)
  - [書き方](#handlerテストの書き方)
  - [カバレッジ結果](#handlerテストのカバレッジ結果)
- [Routerテスト](#routerテスト)
  - [書き方](#routerテストの書き方)
  - [カバレッジ結果](#routerテストのカバレッジ結果)
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
| `GetProfile` | 100.0% |
| `UpdateProfile` | 100.0% |

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestProfileHandler' -coverprofile=/private/tmp/profile-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/profile-cover.out | grep 'profile.go'
`````

### Skill

| 関数 | カバレッジ |
|---|---:|
| `GetSkills` | 100.0% |
| `UpdateSkills` | 100.0% |

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestSkillHandler' -coverprofile=/private/tmp/skill-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/skill-cover.out | grep 'skill.go'
`````

### Project

| 関数 | カバレッジ |
|---|---:|
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

## Routerテスト

### Routerテストの書き方

- 実際のAWSへ接続しないFakeのDynamoDBクライアントをRouterへ注入する
- ルートごとではなく、Routerの責務であるルート登録とHTTPメソッドの振り分けを検証する
- 正常なルート、未登録パス、未対応HTTPメソッドを個別の`t.Run`で検証する

### Routerテストのカバレッジ結果

| 関数 | カバレッジ |
|---|---:|
| `New` | 97.8% |

`````bash
cd apps/api
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/router -cover
`````

## Repositoryテスト

### Repositoryテストの書き方

- 本番コードのメソッドごとにテスト関数を分ける
- 成功・データ未存在・データ変換エラー・DynamoDBエラーを個別の`t.Run`で検証する
- 成功テストでは、DynamoDBデータをモデルへ変換した結果を全フィールド比較する
- 保存・更新テストでは、Fakeが受け取った保存データをモデルへ戻し、期待値と全フィールド比較する
- DynamoDBクライアントは`fakeDynamo`へ差し替え、実際のAWSには接続しない
- テストの冒頭には、対象メソッドと検証する観点をコメントで残す
- テストメッセージは英語で記述する

保存・更新処理では、引数の型が`model.Profile`や`model.Skill`などのモデル型に決まっている。各モデルのフィールドもDynamoDBが扱える型だけで構成されているため、`attributevalue.MarshalMap`による変換は基本的に失敗しない。

そのため、変換失敗のテストは実施していない。一方、変換後のデータをDynamoDBへ保存する処理については、成功・失敗の両方をテストしている。

### Repositoryテストのカバレッジ結果

#### ProfileRepository

| 関数 | カバレッジ |
|---|---:|
| `GetProfile` | 100.0% |
| `UpdateProfile` | 87.5% |

`````bash
cd apps/api
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/repository -run '^TestProfileRepository' -coverprofile=/private/tmp/profile-repository-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/profile-repository-cover.out | grep 'profile.go'
`````

Repository全体のカバレッジは`96.7%`。

#### SkillRepository

| 関数 | カバレッジ |
|---|---:|
| `GetSkills` | 100.0% |
| `UpdateSkills` | 85.7% |

`````bash
cd apps/api
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/repository -run '^TestSkillRepository' -coverprofile=/private/tmp/skill-repository-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/skill-repository-cover.out | grep 'skill.go'
`````

#### ProjectRepository

| 関数 | カバレッジ |
|---|---:|
| `ListProjects` | 100.0% |
| `GetProject` | 100.0% |
| `SaveProject` | 85.7% |
| `DeleteProject` | 100.0% |

`````bash
cd apps/api
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/repository -run '^TestProjectRepository' -coverprofile=/private/tmp/project-repository-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/project-repository-cover.out | grep 'project.go'
`````

#### ArticleRepository

| 関数 | カバレッジ |
|---|---:|
| `GetArticle` | 100.0% |
| `ListArticles` | 100.0% |
| `SaveArticle` | 85.7% |
| `DeleteArticle` | 100.0% |

Get・List・Saveでは、Articleの全フィールドを比較している。Listでは複数のArticleを使い、0件の場合は`NotFound`を返すことも検証している。

`````bash
cd apps/api
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/repository -run '^TestArticleRepository' -coverprofile=/private/tmp/article-repository-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/article-repository-cover.out | grep 'article.go'
`````

#### CareerRepository

| 関数 | カバレッジ |
|---|---:|
| `ListCareers` | 100.0% |
| `GetCareer` | 100.0% |
| `SaveCareer` | 85.7% |
| `DeleteCareer` | 100.0% |

Get・List・Saveでは、Careerの全フィールドを比較している。Listでは複数のCareerを使い、0件の場合は`NotFound`を返すことも検証している。

`````bash
cd apps/api
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/repository -run '^TestCareerRepository' -coverprofile=/private/tmp/career-repository-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/career-repository-cover.out | grep 'career.go'
`````

#### DynamoDBエラー分類

| 関数 | カバレッジ |
|---|---:|
| `classifyDynamoError` | 100.0% |

DynamoDBのタイムアウト、スロットリング、権限エラー、テーブル不存在などが、適切なアプリケーションエラーへ分類されることを検証している。

`````bash
cd apps/api
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/repository -run '^TestClassifyDynamoError$' -coverprofile=/private/tmp/dynamo-error-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/dynamo-error-cover.out | grep 'dynamo_error.go'
`````

#### Repository全体

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/repository -coverprofile=/private/tmp/repository-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/repository-cover.out
`````
