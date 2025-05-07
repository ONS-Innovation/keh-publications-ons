variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
}

variable "aws_access_key_id" {
  description = "AWS Access Key ID"
  type        = string
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key"
  type        = string
}

variable "container_image" {
  description = "Container image"
  type        = string
  default     = "sdp-dev-publications"
}

variable "container_ver" {
  description = "Container tag"
  type        = string
  default     = "v0.0.1"
}

variable "container_port" {
  description = "Container port"
  type        = number
  default     = 3000
}

variable "service_subdomain" {
  description = "Service subdomain"
  type        = string
  default     = "publications"
}

variable "domain" {
  description = "Domain"
  type        = string
  default     = "sdp-dev"
}

variable "domain_extension" {
  description = "Domain extension"
  type        = string
  default     = "aws.onsdigital.uk"
}

variable "service_cpu" {
  description = "Service CPU"
  type        = number
  default     = 1024
}

variable "service_memory" {
  description = "Service memory"
  type        = number
  default     = 2048
}

variable "task_count" {
  description = "Number of instances of the service to run"
  type        = number
  default     = 1
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-2"
}

variable "log_retention_days" {
  description = "Log retention days"
  type        = number
  default     = 90
}

variable "github_org" {
  description = "Github Organisation"
  type        = string
  default     = "ONS-Innovation"
}

variable "project_tag" {
  description = "Project"
  type        = string
  default     = "SDP"
}

variable "team_owner_tag" {
  description = "Team Owner"
  type        = string
  default     = "Knowledge Exchange Hub"
}

variable "business_owner_tag" {
  description = "Business Owner"
  type        = string
  default     = "DST"
}

variable "force_deployment" {
  description = "Force new task definition deployment"
  type        = string
  default     = "true"
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket that the application needs to access"
  type        = string
  default     = "sdp-dev-tech-radar"
}


variable "frontend_ecr_repo" {
  description = "Frontend ECR repository"
  type        = string
  default     = "sdp-dev-publications"
}


locals {
  url         = "${var.domain}.${var.domain_extension}"
  service_url = "${var.service_subdomain}.${local.url}"
}