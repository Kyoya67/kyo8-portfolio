/********************************************************
 * API Gateway
 ********************************************************/

resource "aws_api_gateway_rest_api" "kyo8_portfolio" {
  api_key_source    = "HEADER"
  name              = "kyo8-portfolio-${var.env}"
  put_rest_api_mode = "overwrite"
  endpoint_configuration {
    ip_address_type = "ipv4"
    types           = ["REGIONAL"]
  }
}

/********************************************************
 * API Gateway Stages
 ********************************************************/

resource "aws_api_gateway_stage" "v1" {
  deployment_id = aws_api_gateway_deployment.kyo8_portfolios.id
  rest_api_id   = aws_api_gateway_rest_api.kyo8_portfolio.id
  stage_name    = "v1"
}

/********************************************************
 * API Gateway Deployment
 ********************************************************/
resource "aws_api_gateway_deployment" "kyo8_portfolios" {
  rest_api_id = aws_api_gateway_rest_api.kyo8_portfolio.id
  # trigggers = {
  #   redeploy = sha1(jsonencode(local.api_endpoints))
  # }
}

/********************************************************
 * API Gateway Resource: /{proxy+}
 ********************************************************/

resource "aws_api_gateway_resource" "proxy" {
  parent_id   = aws_api_gateway_rest_api.kyo8_portfolio.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.kyo8_portfolio.id
  path_part   = "{proxy+}"
}

/********************************************************
 * GET
 ********************************************************/

resource "aws_api_gateway_method" "proxy_get" {
  authorization = "NONE"
  http_method   = "GET"
  request_parameters = {
    "method.request.path.proxy" = true
  }
  resource_id = aws_api_gateway_resource.proxy.id
  rest_api_id = aws_api_gateway_rest_api.kyo8_portfolio.id
}

resource "aws_api_gateway_integration" "proxy_get" {
  connection_type         = "INTERNET"
  http_method             = "GET"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  resource_id             = aws_api_gateway_resource.proxy.id
  response_transfer_mode  = "BUFFERED"
  rest_api_id             = aws_api_gateway_rest_api.kyo8_portfolio.id
  timeout_milliseconds    = 29000
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:ap-northeast-1:lambda:path/2015-03-31/functions/${var.api_lambda_arn}/invocations"
}

/********************************************************
 * API Gateway Resource: /admin/{proxy+}
 ********************************************************/

resource "aws_api_gateway_resource" "admin" {
  parent_id   = aws_api_gateway_rest_api.kyo8_portfolio.root_resource_id
  path_part   = "admin"
  rest_api_id = aws_api_gateway_rest_api.kyo8_portfolio.id
}

resource "aws_api_gateway_resource" "admin_proxy" {
  parent_id   = aws_api_gateway_resource.admin.id
  path_part   = "{proxy+}"
  rest_api_id = aws_api_gateway_rest_api.kyo8_portfolio.id
}

/********************************************************
 * API Gateway Authorizer: Cognito User Pools
 ********************************************************/
resource "aws_api_gateway_authorizer" "cognito_kyo8_portfolio" {
  authorizer_result_ttl_in_seconds = 300
  identity_source                  = "method.request.header.Authorization"
  name                             = "cognito-kyo8-portfolio-${var.env}"
  provider_arns                    = ["arn:aws:cognito-idp:ap-northeast-1:${var.account_id}:userpool/ap-northeast-1_eXwFoX41t"]
  region                           = "ap-northeast-1"
  rest_api_id                      = aws_api_gateway_rest_api.kyo8_portfolio.id
  type                             = "COGNITO_USER_POOLS"
}

/********************************************************
 * POST
 ********************************************************/

resource "aws_api_gateway_method" "admin_proxy_post" {
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_kyo8_portfolio.id
  http_method   = "POST"
  request_parameters = {
    "method.request.path.proxy" = true
  }
  resource_id = aws_api_gateway_resource.admin_proxy.id
  rest_api_id = aws_api_gateway_rest_api.kyo8_portfolio.id
}

resource "aws_api_gateway_integration" "admin_proxy_post" {
  cache_key_parameters    = ["method.request.path.proxy"]
  connection_type         = "INTERNET"
  http_method             = "POST"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  resource_id             = aws_api_gateway_resource.admin_proxy.id
  response_transfer_mode  = "BUFFERED"
  rest_api_id             = aws_api_gateway_rest_api.kyo8_portfolio.id
  timeout_milliseconds    = 29000
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:ap-northeast-1:lambda:path/2015-03-31/functions/${var.api_lambda_arn}/invocations"
}

/********************************************************
 * PUT
 ********************************************************/

resource "aws_api_gateway_method" "admin_proxy_put" {
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_kyo8_portfolio.id
  http_method   = "PUT"
  request_parameters = {
    "method.request.path.proxy" = true
  }
  resource_id = aws_api_gateway_resource.admin_proxy.id
  rest_api_id = aws_api_gateway_rest_api.kyo8_portfolio.id
}

resource "aws_api_gateway_integration" "admin_proxy_put" {
  connection_type         = "INTERNET"
  http_method             = "PUT"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  resource_id             = aws_api_gateway_resource.admin_proxy.id
  response_transfer_mode  = "BUFFERED"
  rest_api_id             = aws_api_gateway_rest_api.kyo8_portfolio.id
  timeout_milliseconds    = 29000
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:ap-northeast-1:lambda:path/2015-03-31/functions/${var.api_lambda_arn}/invocations"
}

/********************************************************
 * DELETE
 ********************************************************/

resource "aws_api_gateway_method" "admin_proxy_delete" {
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_kyo8_portfolio.id
  http_method   = "DELETE"
  request_parameters = {
    "method.request.path.proxy" = true
  }
  resource_id = aws_api_gateway_resource.admin_proxy.id
  rest_api_id = aws_api_gateway_rest_api.kyo8_portfolio.id
}

resource "aws_api_gateway_integration" "admin_proxy_delete" {
  cache_key_parameters    = ["method.request.path.proxy"]
  connection_type         = "INTERNET"
  http_method             = "DELETE"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  resource_id             = aws_api_gateway_resource.admin_proxy.id
  response_transfer_mode  = "BUFFERED"
  rest_api_id             = aws_api_gateway_rest_api.kyo8_portfolio.id
  timeout_milliseconds    = 29000
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:ap-northeast-1:lambda:path/2015-03-31/functions/${var.api_lambda_arn}/invocations"
}

/********************************************************
 * OPTIONS
 ********************************************************/

resource "aws_api_gateway_method" "admin_proxy_options" {
  authorization = "NONE"
  http_method   = "OPTIONS"
  request_parameters = {
    "method.request.path.proxy" = true
  }
  resource_id = aws_api_gateway_resource.admin_proxy.id
  rest_api_id = aws_api_gateway_rest_api.kyo8_portfolio.id
}

resource "aws_api_gateway_integration" "admin_proxy_options" {
  connection_type         = "INTERNET"
  http_method             = "OPTIONS"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  resource_id             = aws_api_gateway_resource.admin_proxy.id
  response_transfer_mode  = "BUFFERED"
  rest_api_id             = aws_api_gateway_rest_api.kyo8_portfolio.id
  timeout_milliseconds    = 29000
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:ap-northeast-1:lambda:path/2015-03-31/functions/${var.api_lambda_arn}/invocations"
}
