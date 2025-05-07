# Create IAM role for the ECS task
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.service_subdomain}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Attach basic permission policies to the ECS task role
resource "aws_iam_role_policy" "ecs_task_policy" {
  name = "${var.service_subdomain}-ecs-task-policy"
  role = aws_iam_role.ecs_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Attach CloudWatch Logs policy to the task role
resource "aws_iam_role_policy" "task_logs_policy" {
  name = "${var.domain}-${var.service_subdomain}-logs-policy"
  role = aws_iam_role.ecs_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "arn:aws:logs:eu-west-2:${var.aws_account_id}:log-group:/ecs/ecs-service-*:*"
      }
    ]
  })
}

# Custom policy for S3 read-only access to specific bucket
resource "aws_iam_role_policy" "s3_read_only" {
  name = "${var.domain}-${var.service_subdomain}-s3-read-only"
  role = aws_iam_role.ecs_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
          "s3:GetObjectVersion",
          "s3:PutObject"
        ]
        Resource = [
          "arn:aws:s3:::${var.s3_bucket_name}",
          "arn:aws:s3:::${var.s3_bucket_name}/*",
        ]
      }
    ]
  })
}
