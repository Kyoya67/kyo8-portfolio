# kyo8-portfolio staging infrastructure

このディレクトリは、Amplify以外のstg環境AWSリソースをTerraformで管理するための環境ディレクトリです。

## 初期化

リポジトリルートから実行します。

`````bash
terraform -chdir=infra/envs/stg init
terraform -chdir=infra/envs/stg validate
`````

現段階ではstateをローカルに保存します。既存リソースのimportが完了し、state管理用のS3バケットを用意した後に、リモートbackendへ移行します。

## 対象外

Amplify HostingのリソースはTerraform管理の対象外です。
