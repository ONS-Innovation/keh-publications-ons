# Create a service running on fargate with a task definition and service definition
terraform {
  backend "s3" {
  }
}

module "cognito" {
  source = "git::https://github.com/ONS-Innovation/keh-cognito-auth-tf-module.git?ref=v1.0.0"

  domain             = var.domain
  service_subdomain  = var.service_subdomain
  domain_extension   = var.domain_extension
  region             = var.region
  project_tag        = var.project_tag
  team_owner_tag     = var.team_owner_tag
  business_owner_tag = var.business_owner_tag
  service_title      = var.service_title
}
