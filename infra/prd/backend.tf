terraform {
  backend "s3" {
    bucket  = "k8-terraform-prd"
    key     = "main.tfstate"
    region  = "ap-northeast-1"
    profile = "kyo8-portfolio-prd"
  }
}
