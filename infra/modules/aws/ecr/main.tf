resource "aws_ecr_repository" "lambda_api" {
  name                 = "kyo8-portfolio-lambda-api-${var.env}"
  image_tag_mutability = var.image_tag_mutability
}

resource "aws_ecr_lifecycle_policy" "lifecycle_policy" {
  repository = aws_ecr_repository.lambda_api.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "最新の3つのイメージのみを保持"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 3
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

