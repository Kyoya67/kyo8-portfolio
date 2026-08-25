module "iam_role" {
  source     = "../modules/aws/iam_role"
  env        = local.env
  account_id = local.account_id
  region     = local.region
}
