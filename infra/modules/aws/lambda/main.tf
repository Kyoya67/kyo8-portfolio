resource "aws_lambda_function" "kyo8_portfolio_api" {
  architectures                  = ["arm64"]
  function_name                  = "kyo8-portfolio-api-${var.env}"
  image_uri                      = "145888859080.dkr.ecr.ap-northeast-1.amazonaws.com/kyo8-portfolio-lambda-api-${var.env}:9ee62a6"
  memory_size                    = 128
  package_type                   = "Image"
  reserved_concurrent_executions = -1
  role                           = var.role_arn.lambda_api
  timeout                        = 3
  lifecycle {
    ignore_changes = [image_uri]
  }
}

resource "aws_lambda_permission" "api_gateway_kyo8_portfolio_api" {
  statement_id  = "apigateway-all"
  action        = "lambda:InvokeFunction"
  function_name = "kyo8-portfolio-api-${var.env}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:ap-northeast-1:145888859080:763cenil1m/*/*/*"
}

resource "aws_lambda_function" "kyo8_portfolio_batch" {
  architectures                  = ["arm64"]
  function_name                  = "kyo8-portfolio-batch-${var.env}"
  image_uri                      = "145888859080.dkr.ecr.ap-northeast-1.amazonaws.com/kyo8-portfolio-lambda-api-${var.env}:9ee62a6"
  memory_size                    = 128
  package_type                   = "Image"
  reserved_concurrent_executions = -1
  role                           = var.role_arn.lambda_batch
  timeout                        = 3
  image_config {
    command = ["batch"]

  }
  lifecycle {
    ignore_changes = [image_uri]
  }
}
