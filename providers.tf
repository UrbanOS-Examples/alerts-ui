locals {
  eks_cluster_name = "streaming-kube-${terraform.workspace}"
}

terraform {
  backend "s3" {
    key     = "alerts-ui"
    encrypt = true
  }
}

provider "helm" {
  version = ">=2.4.1"
  kubernetes {
    host                   = data.aws_ssm_parameter.cluster_endpoint.value
    cluster_ca_certificate = base64decode(data.aws_ssm_parameter.cluster_ca_certificate.value)
    exec {
      api_version = "client.authentication.k8s.io/v1alpha1"
      args        = ["eks", "get-token", "--cluster-name", local.eks_cluster_name, "--role-arn", var.os_role_arn]
      command     = "aws"
    }
  }
}

provider "aws" {
  version = "~> 3.0"
  region  = var.os_region

  assume_role {
    role_arn = var.os_role_arn
  }
}
