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

module "api_gateway" {
  source         = "../modules/aws/api_gateway"
  env            = local.env
  api_lambda_arn = module.lambda.lambda_api_arn
}

module "cognito" {
  source = "../modules/aws/cognito"
  env    = local.env
  urls   = ["http://localhost:3001", "https://admin.stg.kyo8.dev"]
}

module "dynamoDB" {
  source = "../modules/aws/dynamoDB"
  env    = local.env
}

module "acm_cloud_pratica_com_ap_northeast_1" {
  source      = "../modules/aws/acm_unit"
  domain_name = "*.${local.base_host}"
  region      = local.region
}

module "route53" {
  source  = "../modules/aws/route53"
  zone_id = "Z00967331CHXOCE6YU4S6"

  records = [
    {
      name   = "_c7a1f98c41e2dbfddd66cb6dab387f75.stg.kyo8.dev"
      type   = "CNAME"
      ttl    = 300
      values = ["_9f79abac4b9be6f5dd3a1a5834eb46e0.jkddzztszm.acm-validations.aws."]
    },
    {
      name   = "_6228e76244d0484503ba9f8264899a87.stg.kyo8.dev"
      type   = "CNAME"
      ttl    = 500
      values = ["_e69ac7cabef027c212c78f1d12df7c6d.jkddzztszm.acm-validations.aws."]
    },
    {
      name   = "_8379528e8cc6a085731662482501c545.admin.stg.kyo8.dev"
      type   = "CNAME"
      ttl    = 500
      values = ["_63b01cdd44b60e6381164383b69aa377.jkddzztszm.acm-validations.aws."]
    },
    {
      name = "stg.kyo8.dev"
      type = "A"
      alias = {
        evaluate_target_health = false
        name                   = "d3l51suhc4y2z0.cloudfront.net"
        zone_id                = "Z2FDTNDATAQYW2"
      }
    },
    {
      name = "admin.stg.kyo8.dev"
      type = "A"
      alias = {
        evaluate_target_health = false
        name                   = "d1hzzsokkx6d5f.cloudfront.net"
        zone_id                = "Z2FDTNDATAQYW2"
      }
    },
    {
      name = "api-v1.stg.kyo8.dev"
      type = "A"
      alias = {
        evaluate_target_health = false
        name                   = "d-7l22g1rytb.execute-api.ap-northeast-1.amazonaws.com"
        zone_id                = "Z1YSHQZHG15GKL"
      }
    }
  ]
}
