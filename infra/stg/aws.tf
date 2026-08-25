module "iam_role" {
  source     = "../modules/aws/iam_role"
  env        = local.env
  account_id = local.account_id
  region     = local.region
}

module "ecr" {
  source = "../modules/aws/ecr"
  env    = local.env
}

module "lambda" {
  source = "../modules/aws/lambda"
  env    = local.env
  role_arn = {
    lambda_api   = module.iam_role.lambda_api_arn
    lambda_batch = module.iam_role.lambda_batch_arn
  }
}

module "event_bridge_scheduler" {
  source                   = "../modules/aws/event_bridge_scheduler"
  env                      = local.env
  batch_lambda_arn         = module.lambda.lambda_batch_arn
  batch_scheduler_role_arn = module.iam_role.batch_scheduler_arn
}
