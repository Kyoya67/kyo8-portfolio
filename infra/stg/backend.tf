terraform {
  backend "s3" {
    bucket = "kyo8-portfolio-terraform-stg"
    key    = "main.tfstate"
    region = "ap-northeast-1"
    profile = "kyo8-portfolio-stg"
  }
}
