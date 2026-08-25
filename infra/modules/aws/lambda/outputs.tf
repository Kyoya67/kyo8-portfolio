output "lambda_api_arn" {
  value = aws_lambda_function.kyo8_portfolio_api.arn
}

output "lambda_batch_arn" {
  value = aws_lambda_function.kyo8_portfolio_batch.arn
}
