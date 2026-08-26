resource "aws_dynamodb_table" "project" {
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  name         = "project-${var.env}"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "skill" {
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  name         = "skill-${var.env}"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "article" {
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  name         = "article-${var.env}"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "career" {
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  name         = "career-${var.env}"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "profile" {
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  name         = "profile-${var.env}"

  attribute {
    name = "id"
    type = "S"
  }
}
