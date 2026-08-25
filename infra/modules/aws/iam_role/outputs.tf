output "lambda_api_arn" {
  value = aws_iam_role.lambda_api.arn
}

output "lambda_batch_arn" {
  value = aws_iam_role.lambda_batch.arn
}
