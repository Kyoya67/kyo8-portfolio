resource "aws_scheduler_schedule" "sync_zenn_article" {
  group_name                   = "default"
  name                         = "sync-zenn-article-${var.env}"
  region                       = "ap-northeast-1"
  schedule_expression          = "cron(00 23 * * ? *)"
  schedule_expression_timezone = "Japan"
  state                        = "ENABLED"
  flexible_time_window {
    mode = "OFF"
  }
  target {
    arn      = var.batch_lambda_arn
    role_arn = var.batch_scheduler_role_arn
    retry_policy {
      maximum_event_age_in_seconds = 86400
      maximum_retry_attempts       = 0
    }
  }
}
