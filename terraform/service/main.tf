# Create a service running on fargate with a task definition and service definition
terraform {
  backend "s3" {
    # Backend is selected using terraform init -backend-config=path/to/backend-<env>.tfbackend
    # bucket         = "sdp-dev-tf-state"
    # key            = "sdp-dev-ecs-example-service/terraform.tfstate"
    # region         = "eu-west-2"
    # dynamodb_table = "terraform-state-lock"
  }

}

# Create CloudWatch Log Groups beforehand
resource "aws_cloudwatch_log_group" "frontend_logs" {
  name              = "/ecs/ecs-service-${var.service_subdomain}-frontend"
  retention_in_days = var.log_retention_days
}

resource "aws_ecs_task_definition" "ecs_service_definition" {
  family = "ecs-service-${var.service_subdomain}-application"
  container_definitions = jsonencode([
    {
      # Frontend Container
      name      = "${var.service_subdomain}-task-application"
      image     = "${var.aws_account_id}.dkr.ecr.${var.region}.amazonaws.com/${var.frontend_ecr_repo}:${var.container_ver}"
      cpu       = var.service_cpu
      memory    = var.service_memory
      essential = true
      portMappings = [
        {
          containerPort = var.container_port,
          hostPort      = var.container_port,
          protocol      = "tcp"
        }
      ],
      healthCheck = {
        command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:${var.container_port}/api/health || exit 1"],
        interval    = 30,
        timeout     = 15,
        retries     = 3,
        startPeriod = 30
      },
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.frontend_logs.name,
          "awslogs-region"        = var.region,
          "awslogs-stream-prefix" = "ecs"
        }
      },
      environment = [
        {
          name  = "NODE_ENV",
          value = "production"
        },
        {
          name  = "PORT",
          value = "${var.container_port}"
        },
        {
          name  = "HOSTNAME",
          value = "0.0.0.0"
        }
      ]
    },
  ])
  execution_role_arn       = "arn:aws:iam::${var.aws_account_id}:role/ecsTaskExecutionRole"
  task_role_arn           = aws_iam_role.ecs_task_role.arn
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = var.service_cpu
  memory                  = var.service_memory
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture       = "X86_64"
  }
}

resource "aws_ecs_service" "application" {
  name             = "${var.service_subdomain}-service"
  cluster          = data.terraform_remote_state.ecs_infrastructure.outputs.ecs_cluster_id
  task_definition  = aws_ecs_task_definition.ecs_service_definition.arn
  desired_count    = var.task_count
  launch_type      = "FARGATE"
  platform_version = "LATEST"

  force_new_deployment               = var.force_deployment
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  enable_ecs_managed_tags = true # It will tag the network interface with service name
  wait_for_steady_state   = true # Terraform will wait for the service to reach a steady state before continuing

  # Add dependencies to ensure target groups are created first
  depends_on = [
    aws_lb_listener_rule.publications_frontend_rule,
    aws_lb_listener_rule.publications_all_paths_rule,
  ]

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_new_tg.arn
    container_name   = "${var.service_subdomain}-task-application"
    container_port   = var.container_port
  }


  # We need to wait until the target group is attached to the listener
  # and also the load balancer so we wait until the listener creation
  # is complete first
  network_configuration {
    subnets         = data.terraform_remote_state.ecs_infrastructure.outputs.private_subnets
    security_groups = [aws_security_group.allow_rules_service.id]

    # TODO: The container fails to launch unless a public IP is assigned
    # For a private ip, you would need to use a NAT Gateway?
    assign_public_ip = true
  }

}
