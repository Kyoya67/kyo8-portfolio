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

resource "aws_iam_role_policy_attachment" "lambda_api" {
  role = "kyo8-portfolio-lambda-api-${var.env}"
  for_each = {
    AWSLambdaBasicExecutionRole = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    execution-dynamo            = "arn:aws:iam::${var.account_id}:policy/execution-dynamo-${var.env}"
  }
  policy_arn = each.value
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

resource "aws_iam_role_policy_attachment" "lambda_batch" {
  role = "kyo8-portfolio-lambda-batch-${var.env}"
  for_each = {
    AWSLambdaBasicExecutionRole = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    execution-dynamo            = "arn:aws:iam::${var.account_id}:policy/execution-dynamo-${var.env}"
  }
  policy_arn = each.value
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
        Federated = "arn:aws:iam::${var.account_id}:oidc-provider/token.actions.githubusercontent.com"
      }
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_role_policy_attachment" "github_actions" {
  role = "github-actions-${var.env}"
  for_each = {
    ecr-push                   = "arn:aws:iam::${var.account_id}:policy/ecr-push-${var.env}"
    lambda-update              = "arn:aws:iam::${var.account_id}:policy/lambda-update-${var.env}"
    secrets-manager-read       = "arn:aws:iam::${var.account_id}:policy/secrets-manager-read-${var.env}"
    parameter-store-read-write = "arn:aws:iam::${var.account_id}:policy/parameter-store-read-write-${var.env}"
  }
  policy_arn = each.value
}

/************************************************************
EventBridge Scheduler Batch execution role
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

resource "aws_iam_role_policy_attachment" "batch_scheduler" {
  role       = "kyo8-portfolio-batch-scheduler-${var.env}"
  policy_arn = "arn:aws:iam::${var.account_id}:policy/kyo8-portfolio-batch-invoke-lambda-${var.env}"
}

