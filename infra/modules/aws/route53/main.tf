resource "aws_route53_record" "this" {
  for_each = { for record in var.records : record.name => record }

  name    = each.value.name
  type    = each.value.type
  zone_id = var.zone_id
  ttl     = try(each.value.ttl, null)
  records = try(each.value.values, null)

  dynamic "alias" {
    for_each = each.value.alias == null ? [] : [each.value.alias]

    content {
      evaluate_target_health = alias.value.evaluate_target_health
      name                   = alias.value.name
      zone_id                = alias.value.zone_id
    }
  }
}
