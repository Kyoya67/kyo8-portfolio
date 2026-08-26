variable "zone_name" {
  type = string
}
variable "records" {
  type = list(object({
    name   = string
    type   = string
    values = optional(list(string))
    ttl    = optional(number)
    alias = optional(object({
      zone_id                = string
      name                   = string
      evaluate_target_health = bool
    }))
  }))
}
