variable "vpc_id" {
  type = string
  description = "VPC ID where EKS will be deployed"
}

variable "subnet_ids" {
  type = list(string)
  description = "Subnet IDs where EKS will be deployed"
}

variable "cluster_name" {
  type = string
  description = "EKS cluster name"
  default = "expense-tracker-cluster"
}
