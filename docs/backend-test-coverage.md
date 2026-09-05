# Backendテストカバレッジ

## テストの書き方

- 本番コードの関数ごとにテスト関数を分ける
- 成功・入力エラー・Serviceエラーをサブテストに分ける
- Handlerの依存先はFakeに差し替える
- HTTPステータス、エラーコード、メッセージを検証する

## カバレッジ結果

2026-09-05時点。Profileのテストだけを実行し、`profile.go`の関数単位で確認した結果。

| 対象ファイル | 関数 | カバレッジ |
|---|---|---:|
| `profile.go` | `NewProfileHandler` | 100.0% |
| `profile.go` | `GetProfile` | 100.0% |
| `profile.go` | `UpdateProfile` | 100.0% |

Profileテストの実行例：

`````bash
GOCACHE=/private/tmp/kyo8-go-cache go test ./internal/handler -run '^TestProfileHandler' -coverprofile=/private/tmp/profile-cover.out
GOCACHE=/private/tmp/kyo8-go-cache go tool cover -func=/private/tmp/profile-cover.out | grep 'profile.go'
`````
