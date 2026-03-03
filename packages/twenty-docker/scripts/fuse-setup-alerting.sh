#!/usr/bin/env bash
# Set up Fuse production alerting: SNS topic + CloudWatch alarms.
#
# Creates:
#   1. SNS topic "fuse-prod-alerts" with email subscription
#   2. CloudWatch alarm on EC2 StatusCheckFailed
#   3. CloudWatch alarm on RDS FreeStorageSpace < 2GB
#   4. CloudWatch alarm on RDS CPUUtilization > 85%
#   5. CloudWatch alarm on custom Fuse/Production FuseHealthCheck = 0
#
# Prerequisites: AWS CLI configured with cloudwatch, sns, ec2 permissions.
#
# Usage:
#   ALERT_EMAIL=dhruv@fusegtm.com \
#   EC2_INSTANCE_ID=i-05b90467e22fec9d2 \
#   RDS_INSTANCE_ID=fuse-prod-db \
#   bash packages/twenty-docker/scripts/fuse-setup-alerting.sh
set -euo pipefail

ALERT_EMAIL="${ALERT_EMAIL:?ALERT_EMAIL required}"
EC2_INSTANCE_ID="${EC2_INSTANCE_ID:?EC2_INSTANCE_ID required}"
RDS_INSTANCE_ID="${RDS_INSTANCE_ID:-fuse-prod-db}"
REGION="${AWS_DEFAULT_REGION:-us-east-1}"
SNS_TOPIC_NAME="${SNS_TOPIC_NAME:-fuse-prod-alerts}"

log() { echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") $*"; }

# --- SNS Topic ---
log "Creating SNS topic ${SNS_TOPIC_NAME}..."
TOPIC_ARN="$(aws sns create-topic \
  --name "$SNS_TOPIC_NAME" \
  --region "$REGION" \
  --query 'TopicArn' \
  --output text)"
log "Topic ARN: ${TOPIC_ARN}"

log "Subscribing ${ALERT_EMAIL}..."
aws sns subscribe \
  --topic-arn "$TOPIC_ARN" \
  --protocol email \
  --notification-endpoint "$ALERT_EMAIL" \
  --region "$REGION" \
  --output text >/dev/null
log "Subscription created (confirm via email)"

# --- Alarm 1: EC2 Status Check ---
log "Creating alarm: fuse-ec2-status-check..."
aws cloudwatch put-metric-alarm \
  --alarm-name "fuse-ec2-status-check" \
  --alarm-description "Fuse EC2 instance status check failed" \
  --namespace "AWS/EC2" \
  --metric-name "StatusCheckFailed" \
  --dimensions "Name=InstanceId,Value=${EC2_INSTANCE_ID}" \
  --statistic "Maximum" \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 1 \
  --comparison-operator "GreaterThanOrEqualToThreshold" \
  --alarm-actions "$TOPIC_ARN" \
  --ok-actions "$TOPIC_ARN" \
  --treat-missing-data "breaching" \
  --region "$REGION"

# --- Alarm 2: RDS Free Storage ---
log "Creating alarm: fuse-rds-low-storage..."
aws cloudwatch put-metric-alarm \
  --alarm-name "fuse-rds-low-storage" \
  --alarm-description "Fuse RDS free storage below 2GB" \
  --namespace "AWS/RDS" \
  --metric-name "FreeStorageSpace" \
  --dimensions "Name=DBInstanceIdentifier,Value=${RDS_INSTANCE_ID}" \
  --statistic "Minimum" \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 2147483648 \
  --comparison-operator "LessThanThreshold" \
  --alarm-actions "$TOPIC_ARN" \
  --ok-actions "$TOPIC_ARN" \
  --treat-missing-data "breaching" \
  --region "$REGION"

# --- Alarm 3: RDS CPU ---
log "Creating alarm: fuse-rds-high-cpu..."
aws cloudwatch put-metric-alarm \
  --alarm-name "fuse-rds-high-cpu" \
  --alarm-description "Fuse RDS CPU utilization above 85%" \
  --namespace "AWS/RDS" \
  --metric-name "CPUUtilization" \
  --dimensions "Name=DBInstanceIdentifier,Value=${RDS_INSTANCE_ID}" \
  --statistic "Average" \
  --period 300 \
  --evaluation-periods 3 \
  --threshold 85 \
  --comparison-operator "GreaterThanThreshold" \
  --alarm-actions "$TOPIC_ARN" \
  --ok-actions "$TOPIC_ARN" \
  --treat-missing-data "notBreaching" \
  --region "$REGION"

# --- Alarm 4: Fuse Health Check ---
log "Creating alarm: fuse-app-health-check..."
aws cloudwatch put-metric-alarm \
  --alarm-name "fuse-app-health-check" \
  --alarm-description "Fuse app health check failing (published by cron)" \
  --namespace "Fuse/Production" \
  --metric-name "FuseHealthCheck" \
  --statistic "Minimum" \
  --period 60 \
  --evaluation-periods 3 \
  --threshold 1 \
  --comparison-operator "LessThanThreshold" \
  --alarm-actions "$TOPIC_ARN" \
  --ok-actions "$TOPIC_ARN" \
  --treat-missing-data "breaching" \
  --region "$REGION"

log "Done. Alarms created:"
aws cloudwatch describe-alarms \
  --alarm-name-prefix "fuse-" \
  --region "$REGION" \
  --query 'MetricAlarms[*].{Name:AlarmName,State:StateValue}' \
  --output table

echo ""
echo "IMPORTANT: Confirm the SNS subscription email sent to ${ALERT_EMAIL}"
echo "Then test with: aws sns publish --topic-arn ${TOPIC_ARN} --message 'Test alert' --region ${REGION}"
