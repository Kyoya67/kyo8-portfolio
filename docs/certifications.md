# 保有資格の管理

資格はDynamoDBの `certification-stg` / `certification-prd` テーブルに1件ずつ保存します。
パーティションキーは `id`（文字列）、課金はオンデマンドです。
管理画面のDashboardから「Certifications / 保有資格」を開き、日英の資格名、発行元、取得月（YYYY-MM）、表示順を編集します。
取得月は月単位です。公開About欄は表示順の昇順（同順位はID順）で表示します。

## API

| メソッド | パス | 用途 |
| --- | --- | --- |
| GET | /certifications | 一覧取得。0件は200と空配列 |
| POST | /admin/certifications | 作成 |
| PUT | /admin/certifications/{id} | 更新。URLのIDを使用 |
| DELETE | /admin/certifications/{id} | 削除 |

書き込みは既存のAPI Gateway `/admin/{proxy+}` のCognito authorizerで保護します。
GoのローカルHTTPサーバー単体は既存設計と同様に認証を行いません。
一覧はScanの全ページを取得します。APIエラー時は公開側で資格欄を非表示にし、サーバーログに記録します。
固定のSAAデータへのフォールバックは行いません。削除後に再表示されることを防ぐためです。
公開側の取得は `cache: "no-store"` を指定しているため、更新後はページの再読み込みで反映されます。

## 適用順序

この変更にはTerraform applyが必要です。アプリのマージより先にインフラを適用します。
AWSへ接続できる環境で、このブランチをチェックアウトし、対象環境のAWS認証を設定してください。
以下はリポジトリルートから実行します。まずstgで確認し、その後prdで同じ手順を行います。
`plan` の差分には資格テーブル追加、API Lambdaの環境変数追加、既存DynamoDBポリシーへのテーブルARN追加が含まれます。
環境内の無関係な差分があれば解消してからapplyしてください。

`````bash
terraform -chdir=infra/stg init
terraform -chdir=infra/stg plan -out=certifications.tfplan
terraform -chdir=infra/stg apply certifications.tfplan
`````

API Lambdaは `CERTIFICATION_TABLE_NAME` を利用します。未設定の移行期間は `CAREER_TABLE_NAME` の環境サフィックスを利用します。
新しいテーブルは空です。既存のSAA資格は次のコマンドで一度だけ登録するか、アプリ反映後に管理画面から追加してください。
条件付きPutItemにより、すでに存在するSAAデータは上書きしません。

`````bash
aws dynamodb put-item \
  --region ap-northeast-1 \
  --table-name certification-stg \
  --item file://scripts/data/saa-certification.json \
  --condition-expression 'attribute_not_exists(id)'
`````

本番では認証先を切り替え、上記の `infra/stg` を `infra/prd`、`certification-stg` を `certification-prd` に変更します。
初期データはTerraformリソースとして管理しません。管理画面の変更や削除を後続のapplyで巻き戻さないためです。

インフラと初期データの準備後にアプリを反映します。既存のGitHub ActionsがAPIをデプロイし、Amplifyが公開画面と管理画面をデプロイします。
`GET /certifications`、管理画面での追加・更新・削除、日英のAbout欄を対象環境で確認してください。
Terraform plan/applyと実AWS上の動作確認はAWS認証が必要です。
