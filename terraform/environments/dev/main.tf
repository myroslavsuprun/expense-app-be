provider "aws" {
  region = "us-east-1"
}

module "vpc" {
  source = "../../modules/vpc"
}

module "eks" {
  source = "../../modules/eks"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.subnet_ids
  cluster_name = "expense-tracker-cluster"
}

module "ecr" {
  source = "../../modules/ecr"
  repository_name = "expense-tracker-api"
}

module "acm" {
  source = "../../modules/acm"
  domain_name = "expense-tracker.checkpoint.lat"
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "cluster_name" {
  value = module.eks.cluster_name
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "certificate_arn" {
  value = module.acm.certificate_arn
}

output "domain_validation_options" {
  value = module.acm.domain_validation_options
  description = "DNS records to validate the certificate - add these to your DNS provider"
}
