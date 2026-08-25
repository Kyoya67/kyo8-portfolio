/************************************************************
Lambda API execution role
************************************************************/
resource "aws_iam_role" "lambda_api" {
  name = "kyo8-portfolio-lambda-api-${var.env}"
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

/************************************************************
Lambda Batch execution role
************************************************************/
resource "aws_iam_role" "lambda_batch" {
  name = "kyo8-portfolio-lambda-batch-${var.env}"
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

/************************************************************
GitHub Actions execution role
************************************************************/
resource "aws_iam_role" "github_actions" {
  name = "github-actions-${var.env}"
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          "token.actions.githubusercontent.com:sub" = "repo:Kyoya67@86813838/kyo8-portfolio@1339384256:ref:refs/heads/develop"
        }
      }
      Effect = "Allow"
      Principal = {
        Federated = "arn:aws:iam::145888859080:oidc-provider/token.actions.githubusercontent.com"
      }
    }]
    Version = "2012-10-17"
  })
}

/************************************************************
Batch Scheduler execution role
************************************************************/
resource "aws_iam_role" "batch_scheduler" {
  name = "kyo8-portfolio-batch-scheduler-${var.env}"
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "scheduler.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}
