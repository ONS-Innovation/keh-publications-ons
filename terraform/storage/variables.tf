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

variable "service_subdomain" {
  description = "Service subdomain"
  type        = string
  default     = "publications"
}

variable "domain" {
  description = "Domain name (e.g., sdp-dev)"
  type        = string
  default     = "sdp-dev"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-2"
}

variable "project_tag" {
  description = "Project"
  type        = string
  default     = "KEH"
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


variable "allowed_origins" {
  description = "Allowed origins"
  type        = list(string)
  default     = ["https://publications.sdp-dev.aws.onsdigital.uk/*"]
}
