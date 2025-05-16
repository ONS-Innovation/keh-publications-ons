# Create target group, used by ALB to forward requests to ECS service
resource "aws_lb_target_group" "frontend_tg" {
  name        = "${var.service_subdomain}-frontend-tg"
  port        = var.container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.terraform_remote_state.ecs_infrastructure.outputs.vpc_id

  health_check {
    path                = "/api/health"
    healthy_threshold   = 2
    unhealthy_threshold = 5
    interval            = 60
    timeout             = 30
    matcher             = "200-399"
  }
}

resource "aws_lb_target_group" "frontend_new_tg" {
  name        = "${var.service_subdomain}-front-farg-tg"
  port        = var.container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.terraform_remote_state.ecs_infrastructure.outputs.vpc_id

  health_check {
    path                = "/api/health"
    healthy_threshold   = 2
    unhealthy_threshold = 5
    interval            = 60
    timeout             = 30
    matcher             = "200-399"
  }
}


# Use the module to get highest current priority
module "alb_listener_priority" {
  source                = "git::https://github.com/ONS-Innovation/keh-alb-listener-tf-module.git?ref=v1.0.0"
  aws_access_key_id     = var.aws_access_key_id
  aws_secret_access_key = var.aws_secret_access_key
  region                = var.region
  listener_arn          = data.terraform_remote_state.ecs_infrastructure.outputs.application_lb_https_listener_arn
}

# Review frontend paths - restricted to authorised user pool only (first priority)
resource "aws_lb_listener_rule" "publications_frontend_rule" {
  listener_arn = data.terraform_remote_state.ecs_infrastructure.outputs.application_lb_https_listener_arn
  priority     = module.alb_listener_priority.highest_priority + 1

  condition {
    host_header {
      values = ["${local.service_url}"]
    }
  }

  condition {
    path_pattern {
      values = ["/dashboard", "/dashboard/*", "/api/dashboard/*"]
    }
  }

  action {
    type = "authenticate-cognito"

    authenticate_cognito {
      user_pool_arn       = data.terraform_remote_state.ecs_auth.outputs.cognito_user_pool_arn
      user_pool_client_id = data.terraform_remote_state.ecs_auth.outputs.cognito_user_pool_client_id
      user_pool_domain    = data.terraform_remote_state.ecs_auth.outputs.cognito_user_pool_domain
      on_unauthenticated_request = "authenticate"
      session_timeout            = 3600
      session_cookie_name       = "AuthorisedUserSession"
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_new_tg.arn
  }
}


# General rule for all paths (second priority)
resource "aws_lb_listener_rule" "publications_all_paths_rule" {
  listener_arn = data.terraform_remote_state.ecs_infrastructure.outputs.application_lb_https_listener_arn
  priority     = module.alb_listener_priority.highest_priority + 2

  condition {
    host_header {
      values = ["${local.service_url}"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_new_tg.arn
  }
}
