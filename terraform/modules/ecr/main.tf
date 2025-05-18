resource "aws_ecr_repository" "main" {
  name = var.repository_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

output "repository_url" {
  value = aws_ecr_repository.main.repository_url
}

variable "repository_name" {
  type = string
  description = "ECR repository name"
}
