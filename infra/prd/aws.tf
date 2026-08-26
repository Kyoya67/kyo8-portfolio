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
  source     = "../modules/aws/lambda"
  env        = local.env
  account_id = local.account_id
  # api_gateway_id = module.api_gateway.api_gateway_id
  role_arn = {
    lambda_api   = module.iam_role.lambda_api_arn
    lambda_batch = module.iam_role.lambda_batch_arn
  }
}

# module "event_bridge_scheduler" {
#   source                   = "../modules/aws/event_bridge_scheduler"
#   env                      = local.env
#   batch_lambda_arn         = module.lambda.lambda_batch_arn
#   batch_scheduler_role_arn = module.iam_role.batch_scheduler_arn
# }

module "api_gateway" {
  source         = "../modules/aws/api_gateway"
  env            = local.env
  api_lambda_arn = module.lambda.lambda_api_arn
  user_pool_arn  = module.cognito.user_pool_arn
}

module "cognito" {
  source = "../modules/aws/cognito"
  env    = local.env
  urls   = ["https://admin.kyo8.dev"]
}

# module "dynamoDB" {
#   source = "../modules/aws/dynamoDB"
#   env    = local.env
# }

# module "acm_cloud_pratica_com_ap_northeast_1" {
#   source      = "../modules/aws/acm_unit"
#   domain_name = "*.${local.base_host}"
#   region      = local.region
# }

module "route53" {
  source    = "../modules/aws/route53"
  zone_name = local.base_host
  records = [
    {
      name = "stg.kyo8.dev"
      type = "NS"
      ttl  = 300
      values = [
        "ns-527.awsdns-01.net.",
        "ns-1432.awsdns-51.org.",
        "ns-429.awsdns-53.com.",
        "ns-1835.awsdns-37.co.uk.",
      ]
    }
  ]
}
