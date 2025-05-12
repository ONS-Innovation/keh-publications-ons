# Security Group for the service
resource "aws_security_group" "allow_rules_service" {
  name        = "${var.service_subdomain}-allow-rule"
  description = "Allow inbound traffic for the service"
  vpc_id      = data.terraform_remote_state.ecs_infrastructure.outputs.vpc_id

  # Allow traffic from anywhere to the service
  ingress {
    from_port   = var.container_port
    to_port     = var.container_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow traffic to Next.js application"
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}
