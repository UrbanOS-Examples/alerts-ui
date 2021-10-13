variable "os_region" {
  description = "Region of OS resources"
  default     = "us-west-2"
}

variable "os_role_arn" {
  description = "The ARN for the assume role for OS access"
  default     = ""
  # replaced with env variable TF_VAR_os_role_arn (actions secret)
  # no default. provide from command line when developing locally
}

variable "force_deployment" {
  description = "A variable for forcing the trigger of a deployment"
}

variable "docker_img_tag" {
  description = "The docker image tag to request"
  default = "latest"
}