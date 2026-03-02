# Fuse AWS Infrastructure Manifest

> Created: 2026-03-01 | Region: us-east-1 | Account: 141591874293 (fusegtm)

## Networking

| Resource | ID | Notes |
|---|---|---|
| VPC | `vpc-0c924e1a79fc4197d` | Default VPC, 172.31.0.0/16 |
| Subnet (us-east-1a) | `subnet-00305338fa496feed` | EC2 lives here |
| Subnet (us-east-1b) | `subnet-09dc5c0de065fac85` | RDS multi-AZ subnet |
| Subnet (us-east-1c) | `subnet-061e33471d8deadea` | RDS subnet group member |
| EC2 Security Group | `sg-0baaa9be3a6d5ab93` | Inbound: 22 (restricted), 80, 443. Port 3000 is not public. |
| RDS Security Group | `sg-0d991d734001f4f7e` | Inbound: 5432 from EC2 SG only |

## Compute

| Resource | ID / Value | Notes |
|---|---|---|
| EC2 Instance | `i-05b90467e22fec9d2` | t3.small, Ubuntu 22.04, 30GB gp3 |
| Elastic IP | `52.20.136.71` | Stable public address |
| EIP Allocation | `eipalloc-047bb773550ddc232` | Associated to EC2 |
| SSH Key Pair | `fuse-prod` | ed25519, PEM at `~/.ssh/fuse-prod.pem` |

## Database

| Resource | ID / Value | Notes |
|---|---|---|
| RDS Instance | `fuse-prod-db` | db.t3.micro, PostgreSQL 15.12, 20GB gp3 |
| DB Name | `fuse` | |
| Master User | `postgres` | |
| Master Password | `REDACTED` | Store in AWS Secrets Manager/SSM. Rotate if previously exposed. |
| DB Subnet Group | `fuse-db-subnets` | us-east-1a, 1b, 1c |
| Endpoint | `fuse-prod-db.cgnqkm0s4v6f.us-east-1.rds.amazonaws.com:5432` | Private, reachable from EC2 only |
| Encrypted | Yes (KMS default) | |
| Backups | 7-day retention | |

## IAM

| Resource | Value | Notes |
|---|---|---|
| Deploy User | `fuse-deploy` | EC2 + RDS + S3 full access |
| Deploy Access Key | `REDACTED` | Use short-lived credentials where possible. Rotate if previously exposed. |
| Root Access Key | `REDACTED` | Root keys should remain deactivated. |

## SSH Access

```bash
ssh -i ~/.ssh/fuse-prod.pem ubuntu@52.20.136.71
```

## Connection String (after RDS available)

```
postgresql://postgres:<REDACTED_PASSWORD>@fuse-prod-db.cgnqkm0s4v6f.us-east-1.rds.amazonaws.com:5432/fuse
```

## Cost Estimate

| Service | Monthly |
|---|---|
| EC2 t3.small | ~$15 |
| RDS db.t3.micro | ~$15 |
| EBS 30GB gp3 | ~$3 |
| RDS storage 20GB | ~$3 |
| Elastic IP | $0 (attached) |
| Data transfer | ~$5 |
| **Total** | **~$41/month** |

## Next Steps

1. [Done] RDS endpoint active: `fuse-prod-db.cgnqkm0s4v6f.us-east-1.rds.amazonaws.com`
2. [Done] Docker compose deployed to EC2 with RDS external DB
3. [Done] DNS points `app.fusegtm.com` to `52.20.136.71`
4. [Done] Caddy TLS active with wildcard on-demand certs for `*.fusegtm.com`
5. [Done] Root access keys moved out of default profile; keep deactivated

## DNS and TLS Notes

- `fusegtm.com` remains on Framer (marketing site).
- `*.fusegtm.com` resolves to EC2 for product workspaces (including `app.fusegtm.com`).
- Caddy uses a single wildcard site block with on-demand TLS to avoid explicit/wildcard cert conflicts.
