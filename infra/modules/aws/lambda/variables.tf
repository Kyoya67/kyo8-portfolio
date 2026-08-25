variable "env" {
  type = string
}

variable "role_arn" {
  type = object({
    lambda_api : string
    lambda_batch : string
  })
}
