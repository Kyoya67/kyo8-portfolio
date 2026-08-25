terraform {
  required_version = "~> 1.14.1" // 1.14.1 以上 1.15.0 未満 を許容

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.42.0" // 6.42.0 以上 6.43.0 未満 を許容
    }
  }
}

provider "aws" {
  region  = "ap-northeast-1"
  profile = "kyo8-portfolio-stg"

  default_tags {
    tags = {
      Env = "stg"
    }
  }
}
