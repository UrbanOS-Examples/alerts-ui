resource "helm_release" "alerts-ui" {
  name             = "alerts-ui"
  repository       = "./chart"
  version          = "0.0.1"
  chart            = "."
  namespace        = "alerting-dashboard"
  create_namespace = true
  wait             = false
  recreate_pods    = true

  values =  [file("${path.module}/variables/${terraform.workspace}_values.yaml"),]  
  set_sensitive {
    name  = "ingress.dnsZone"
    value = data.aws_ssm_parameter.dns_zone.value
  }

  set_sensitive {
    name  = "ingress.rootDnsZone"
    value = data.aws_ssm_parameter.root_dns_zone.value
  }

  set_sensitive {
    name  = "ingress.annotations.alb\\.ingress\\.kubernetes\\.io/certificate-arn"
    value = "${data.aws_ssm_parameter.certificate_arn.value}\\,${data.aws_ssm_parameter.root_certificate_arn.value}"
  }

  set_sensitive {
    name  = "ingress.annotations.alb\\.ingress\\.kubernetes\\.io/subnets"
    value = data.aws_ssm_parameter.subnets.value
  }

  set_sensitive {
    name  = "ingress.annotations.alb\\.ingress\\.kubernetes\\.io/security-groups"
    value = data.aws_ssm_parameter.security_groups.value
  }

  set {
    name  = "force.deployment"
    value = var.force_deployment
  }

  set {
    name = "image.tag"
    value = var.docker_img_tag
  }
}

data "aws_ssm_parameter" "dns_zone" {
  name = "${terraform.workspace}_dns_zone"
}

data "aws_ssm_parameter" "root_dns_zone" {
  name = "${terraform.workspace}_root_dns_zone"
}

data "aws_ssm_parameter" "certificate_arn" {
  name = "${terraform.workspace}_certificate_arn"
}

data "aws_ssm_parameter" "root_certificate_arn" {
  name = "${terraform.workspace}_root_certificate_arn"
}

data "aws_ssm_parameter" "subnets" {
  name = "${terraform.workspace}_public_subnets"
}

data "aws_ssm_parameter" "security_groups" {
  name = "${terraform.workspace}_security_group_id"
}

data "aws_ssm_parameter" "cluster_ca_certificate" {
  name = "${terraform.workspace}_eks_cluster_cert_auth_data"
}
data "aws_ssm_parameter" "cluster_endpoint" {
  name = "${terraform.workspace}_eks_cluster_endpoint"
}
