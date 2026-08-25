resource "aws_acm_certificate" "main" {
  domain_name       = var.domain_name
  region            = var.region
  validation_method = "DNS"
}
