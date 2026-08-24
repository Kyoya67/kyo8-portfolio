variable "aws_region" {
  description = "AWS region for the staging environment."
  type        = string
  default     = "ap-northeast-1"
}

variable "aws_profile" {
  description = "AWS CLI profile used by Terraform."
  type        = string
  default     = "kyo8-portfolio-stg-read"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "stg"
}

variable "project_name" {
  description = "Project name used for Terraform tags and resource names."
  type        = string
  default     = "kyo8-portfolio"
}
