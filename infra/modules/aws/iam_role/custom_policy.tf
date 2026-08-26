resource "aws_iam_policy" "secrets_manager_read" {
  name = "secrets-manager-read-${var.env}"
  policy = jsonencode({
    Statement = [{
      Action = [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ]
      Effect   = "Allow"
      Resource = "*"
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_policy" "cognito_admin" {
  name = "cognito-admin-${var.env}"
  policy = jsonencode({
    Statement = [{
      Action = [
        "cognito-idp:ListUserPools",
        "cognito-idp:DescribeUserPool",
        "cognito-idp:UpdateUserPool",
        "cognito-idp:SetUserPoolMfaConfig",
        "cognito-idp:ListUserPoolClients",
        "cognito-idp:DescribeUserPoolClient",
        "cognito-idp:UpdateUserPoolClient",
        "cognito-idp:ListUsers",
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminCreateUser"
      ]
      Effect   = "Allow"
      Resource = "*"
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_policy" "lambda_update" {
  name = "lambda-update-${var.env}"
  policy = jsonencode({
    Statement = [{
      Action = [
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration",
        "lambda:GetFunction",
        "lambda:GetFunctionConfiguration"
      ]
      Effect   = "Allow"
      Resource = "*"
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_policy" "execution_dynamo" {
  name = "execution-dynamo-${var.env}"
  policy = jsonencode({
    Statement = [{
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem"
      ]
      Effect = "Allow"
      Resource = [
        "arn:aws:dynamodb:${var.region}:${var.account_id}:table/profile-${var.env}",
        "arn:aws:dynamodb:${var.region}:${var.account_id}:table/skill-${var.env}"
      ]
      }, {
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:DeleteItem"
      ]
      Effect = "Allow"
      Resource = [
        "arn:aws:dynamodb:${var.region}:${var.account_id}:table/article-${var.env}",
        "arn:aws:dynamodb:${var.region}:${var.account_id}:table/project-${var.env}",
        "arn:aws:dynamodb:${var.region}:${var.account_id}:table/career-${var.env}"
      ]
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_policy" "ecr_push" {
  name = "ecr-push-${var.env}"
  policy = jsonencode({
    Statement = [{
      Action = [
        "ecr:BatchCheckLayerAvailability",
        "ecr:BatchGetImage",
        "ecr:CompleteLayerUpload",
        "ecr:InitiateLayerUpload",
        "ecr:PutImage",
        "ecr:UploadLayerPart"
      ]
      Effect   = "Allow"
      Resource = "arn:aws:ecr:${var.region}:${var.account_id}:repository/kyo8-portfolio-lambda-api-${var.env}"
      Sid      = "PushApiImage"
      }, {
      Action   = "ecr:GetAuthorizationToken"
      Effect   = "Allow"
      Resource = "*"
      Sid      = "AuthenticateToEcr"
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_policy" "batch_invoke_lambda" {
  name = "kyo8-portfolio-batch-invoke-lambda-${var.env}"
  policy = jsonencode({
    Statement = [{
      Action = [
        "lambda:InvokeFunction"
      ]
      Effect = "Allow"
      Resource = [
        "arn:aws:lambda:${var.region}:${var.account_id}:function:kyo8-portfolio-batch-${var.env}:*",
        "arn:aws:lambda:${var.region}:${var.account_id}:function:kyo8-portfolio-batch-${var.env}"
      ]
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_policy" "parameter_store_read_write" {
  name = "parameter-store-read-write-${var.env}"
  policy = jsonencode({
    Statement = [{
      Action = [
        "ssm:PutParameter",
        "ssm:GetParameter"
      ]
      Effect   = "Allow"
      Resource = "*"
    }]
    Version = "2012-10-17"
  })
}
