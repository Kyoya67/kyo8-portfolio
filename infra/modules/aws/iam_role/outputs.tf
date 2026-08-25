output "lambda_api_arn" {
  value = aws_iam_role.lambda_api.arn
}

output "lambda_batch_arn" {
  value = aws_iam_role.lambda_batch.arn
}

output "batch_scheduler_arn" {
  value = aws_iam_role.batch_scheduler.arn
}
