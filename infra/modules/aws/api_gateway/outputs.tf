output "api_gateway_id" {
  value = aws_api_gateway_rest_api.kyo8_portfolio.id
}

output "regional_domain_name" {
  value = aws_api_gateway_domain_name.api.regional_domain_name
}

output "regional_hosted_zone_id" {
  value = aws_api_gateway_domain_name.api.regional_zone_id
}
