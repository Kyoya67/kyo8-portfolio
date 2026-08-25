/********************************************************
 * API Gateway
 ********************************************************/

resource "aws_api_gateway_rest_api" "kyo8_portfolio" {
  api_key_source    = "HEADER"
  name              = "kyo8-portfolio-${var.env}"
  put_rest_api_mode = "overwrite"
  region            = "ap-northeast-1"
  endpoint_configuration {
    ip_address_type = "ipv4"
    types           = ["REGIONAL"]
  }
}

/********************************************************
 * API Gateway Stages
 ********************************************************/

resource "aws_api_gateway_stage" "v1" {
  deployment_id = "l8dyww"
  region        = "ap-northeast-1"
  rest_api_id   = "763cenil1m"
  stage_name    = "v1"
}

/********************************************************
 * API Gateway Resource: /{proxy+}
 ********************************************************/

resource "aws_api_gateway_resource" "proxy" {
  parent_id   = "sr2vp9ebv2"
  path_part   = "{proxy+}"
  region      = "ap-northeast-1"
  rest_api_id = "763cenil1m"
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
  resource_id = "vz4t7l"
  rest_api_id = "763cenil1m"
}

resource "aws_api_gateway_integration" "proxy_get" {
  cache_namespace         = "vz4t7l"
  connection_type         = "INTERNET"
  http_method             = "GET"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  region                  = "ap-northeast-1"
  resource_id             = "vz4t7l"
  response_transfer_mode  = "BUFFERED"
  rest_api_id             = "763cenil1m"
  timeout_milliseconds    = 29000
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:ap-northeast-1:lambda:path/2015-03-31/functions/${var.api_lambda_arn}/invocations"
}

/********************************************************
 * API Gateway Resource: /admin/{proxy+}
 ********************************************************/

resource "aws_api_gateway_resource" "admin" {
  parent_id   = "sr2vp9ebv2"
  path_part   = "admin"
  region      = "ap-northeast-1"
  rest_api_id = "763cenil1m"
}

resource "aws_api_gateway_resource" "admin_proxy" {
  parent_id   = "o5qwbn"
  path_part   = "{proxy+}"
  region      = "ap-northeast-1"
  rest_api_id = "763cenil1m"
}

/********************************************************
 * POST
 ********************************************************/

resource "aws_api_gateway_method" "admin_proxy_post" {
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = "fqdevy"
  http_method   = "POST"
  request_parameters = {
    "method.request.path.proxy" = true
  }
  resource_id = "65e9p2"
  rest_api_id = "763cenil1m"
}

resource "aws_api_gateway_integration" "admin_proxy_post" {
  cache_key_parameters    = ["method.request.path.proxy"]
  cache_namespace         = "65e9p2"
  connection_type         = "INTERNET"
  http_method             = "POST"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  region                  = "ap-northeast-1"
  resource_id             = "65e9p2"
  response_transfer_mode  = "BUFFERED"
  rest_api_id             = "763cenil1m"
  timeout_milliseconds    = 29000
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:ap-northeast-1:lambda:path/2015-03-31/functions/${var.api_lambda_arn}/invocations"
}

/********************************************************
 * PUT
 ********************************************************/

resource "aws_api_gateway_method" "admin_proxy_put" {
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = "fqdevy"
  http_method   = "PUT"
  request_parameters = {
    "method.request.path.proxy" = true
  }
  resource_id = "65e9p2"
  rest_api_id = "763cenil1m"
}

resource "aws_api_gateway_integration" "admin_proxy_put" {
  cache_namespace         = "65e9p2"
  connection_type         = "INTERNET"
  http_method             = "PUT"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  region                  = "ap-northeast-1"
  resource_id             = "65e9p2"
  response_transfer_mode  = "BUFFERED"
  rest_api_id             = "763cenil1m"
  timeout_milliseconds    = 29000
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:ap-northeast-1:lambda:path/2015-03-31/functions/${var.api_lambda_arn}/invocations"
}

/********************************************************
 * DELETE
 ********************************************************/

resource "aws_api_gateway_method" "admin_proxy_delete" {
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = "fqdevy"
  http_method   = "DELETE"
  request_parameters = {
    "method.request.path.proxy" = true
  }
  resource_id = "65e9p2"
  rest_api_id = "763cenil1m"
}

resource "aws_api_gateway_integration" "admin_proxy_delete" {
  cache_key_parameters    = ["method.request.path.proxy"]
  cache_namespace         = "65e9p2"
  connection_type         = "INTERNET"
  http_method             = "DELETE"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  region                  = "ap-northeast-1"
  resource_id             = "65e9p2"
  response_transfer_mode  = "BUFFERED"
  rest_api_id             = "763cenil1m"
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
  resource_id = "65e9p2"
  rest_api_id = "763cenil1m"
}

resource "aws_api_gateway_integration" "admin_proxy_options" {
  cache_namespace         = "65e9p2"
  connection_type         = "INTERNET"
  http_method             = "OPTIONS"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  region                  = "ap-northeast-1"
  resource_id             = "65e9p2"
  response_transfer_mode  = "BUFFERED"
  rest_api_id             = "763cenil1m"
  timeout_milliseconds    = 29000
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:ap-northeast-1:lambda:path/2015-03-31/functions/${var.api_lambda_arn}/invocations"
}
