resource "aws_dynamodb_table" "project" {
  billing_mode = "PAY_PER_REQUEST"
  name         = "project-${var.env}"
}

resource "aws_dynamodb_table" "skill" {
  billing_mode = "PAY_PER_REQUEST"
  name         = "skill-${var.env}"
}

resource "aws_dynamodb_table" "article" {
  billing_mode = "PAY_PER_REQUEST"
  name         = "article-${var.env}"
}

resource "aws_dynamodb_table" "career" {
  billing_mode = "PAY_PER_REQUEST"
  name         = "career-${var.env}"
}

resource "aws_dynamodb_table" "profile" {
  billing_mode = "PAY_PER_REQUEST"
  name         = "profile-${var.env}"
}
