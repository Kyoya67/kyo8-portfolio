# Backendテストカバレッジ

## テストの書き方

- 本番コードのHandler関数ごとに`Test{Handler名}{関数名}`としてテストを分ける
- 各テスト関数の前に、対象関数・引数・URLパラメータ・リクエストボディ・検証内容をコメントで記載する
- サブテストは`success`、入力エラー、Serviceエラーの順番で記述する
- 成功時は処理結果とHTTPステータスを検証する
- 入力エラーは不正なJSONや必須パラメータ不足を実際のRequestで再現する
- ServiceエラーはFakeにエラーを設定し、HTTPステータス・エラーコード・メッセージを共通ヘルパーで検証する
- Handlerの依存先はFakeに差し替え、外部サービスへ接続しない
- 複数のテストで使うヘルパーは`test_helpers_test.go`にまとめる
- Handler固有のヘルパーは対象の`_test.go`に定義する

## カバレッジ結果

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

### エラー処理のテスト責務

エラー情報は層ごとに検証する範囲を分けている。

| 対象 | 検証する責務 |
|---|---|
| `apperrors`テスト | `Error.Err`が元エラーとして保持されること、JSONレスポンスへ公開されないこと |
| Repositoryテスト | 元のDynamoDBエラーが適切なアプリケーションエラーコードへ分類されること |
| Handlerテスト | エラーが`ErrCode`・`Message`・HTTPステータスへ変換されること |
| `ErrorHandler` | `Error.Err`をサーバーログへ出力し、HTTPレスポンスには含めないこと |

この分担により、HandlerテストでRepository内部のエラー詳細まで検証する必要はなく、各層の責務に集中できる。

Repositoryも本番コードのメソッドごとにテスト関数を分け、各テスト内では成功、データ未存在・変換エラー、DynamoDBエラーの順にサブテストを定義している。DynamoDBクライアントは`fakeDynamo`へ差し替え、実際のAWSには接続しない。テストの冒頭には、対象メソッドと検証する観点をコメントで残している。

| 対象 | 結果 |
|---|---:|
| Profile / Skill / Project / Article / Career | 各Repositoryの全メソッドをテスト |
| Repository全体 | 96.9% |

`Save`・`Update`系メソッドの`attributevalue.MarshalMap`失敗分岐は、現在のモデルがMarshal対象として常に有効な型で構成されているため、未実行となっている。DynamoDBへの書き込みエラーは検証している。

`````bash
cd apps/api
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/repository -coverprofile=/private/tmp/repository-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/repository-cover.out
`````
