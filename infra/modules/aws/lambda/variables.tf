variable "env" {
  type = string
}

variable "role_arn" {
  type = object({
    lambda_api : string
    lambda_batch : string
  })
}

variable "account_id" {
  type = string
}

variable "api_gateway_id" {
  type = string
}
