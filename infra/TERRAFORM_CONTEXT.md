# Terraform Context

## Repository

This repository is a monorepo.

- `apps/web`: Public Next.js frontend
- `apps/admin`: Admin Next.js frontend
- `apps/api`: Go backend
- `infra`: Terraform infrastructure

Terraform code is organized as:

- `infra/stg`: Staging environment
- `infra/prd`: Production environment
- `infra/modules/aws`: Reusable AWS modules

## AWS Environments

Staging and production use separate AWS accounts.

Terraform state is stored in separate S3 buckets:

- Staging: `kyo8-portfolio-terraform-stg`
- Production: `kyo8-portfolio-terraform-prd`

The AWS region is:

```text
ap-northeast-1
```

Never apply staging resources using production credentials, or production resources using staging credentials.

## Managed AWS Services

Terraform manages the following services:

- IAM
- ECR
- Lambda
- API Gateway REST API
- Cognito User Pool
- Cognito User Pool App Client
- Cognito User Pool Domain
- DynamoDB
- EventBridge Scheduler
- ACM
- Route 53
- S3

Amplify is managed outside Terraform and must not be imported or modified by Terraform.

## Naming Convention

Environment suffixes must be included in resource names.

Examples:

- `kyo8-portfolio-api-stg`
- `kyo8-portfolio-api-prd`
- `kyo8-portfolio-batch-stg`
- `kyo8-portfolio-batch-prd`
- `profile-stg`
- `profile-prd`

Use lowercase kebab-case for AWS resource names where possible.

Terraform resource names should describe the logical role of the resource, not only the AWS service name.

## Lambda

There are two Lambda functions:

- API Lambda
- Batch Lambda

Both Lambda functions use the same ECR container image.

The image contains two binaries:

- `api`
- `batch`

The API Lambda uses the `api` command.

The Batch Lambda uses the `batch` command through Lambda image configuration.

Lambda functions use ARM64 architecture.

The Lambda container image is built from:

```text
apps/api/Dockerfile
```

The Go module is located at:

```text
apps/api/go.mod
```

## API Gateway

API Gateway is a REST API.

Current logical structure:

```text
REST API
└── /{proxy+}
    └── GET
        └── Public API Lambda

└── /admin
    └── /{proxy+}
        ├── OPTIONS
        ├── POST
        ├── PUT
        └── DELETE
            └── API Lambda
```

Public GET requests do not require Cognito authorization.

Admin write operations require a Cognito User Pool authorizer.

API Gateway Lambda integrations must use the following URI format:

```text
arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambda_arn}/invocations
```

Do not replace this with a plain Lambda ARN.

API Gateway deployments may need replacement when resources or methods change. The stage must point to the active deployment. Be careful when deleting deployments because an active stage cannot point to a deleted deployment.

## Cognito

Cognito is used for administrator authentication.

The frontend uses a public App Client without a client secret and uses the Authorization Code Flow with PKCE.

The Cognito User Pool is connected to API Gateway through a Cognito User Pool authorizer.

Cognito authentication is applied to admin write operations, not public GET operations.

Do not recreate the User Pool or App Client unnecessarily. These resources contain user and authentication state.

## DynamoDB

The following tables exist per environment:

- `profile-${environment}`
- `skill-${environment}`
- `project-${environment}`
- `article-${environment}`
- `career-${environment}`

Each table uses:

```text
id: String
```

as the partition key.

Terraform manages table configuration, not application data.

Do not delete or replace DynamoDB tables without explicit approval because application data may be lost.

## EventBridge Scheduler

EventBridge Scheduler invokes the Batch Lambda.

The scheduler uses an IAM execution role that has permission to invoke the Batch Lambda.

The scheduler is not an API Gateway endpoint and does not require API Gateway configuration.

## IAM

IAM roles and custom policies are managed by Terraform.

Important role categories:

- GitHub Actions deployment role
- API Lambda execution role
- Batch Lambda execution role
- EventBridge Scheduler execution role

Use least-privilege policies where practical.

Do not attach administrator policies unless explicitly requested.

Before deleting a role or policy, verify:

1. Which AWS service uses it
2. Which resource references it
3. Whether it is attached to another role or user

## Route 53 and ACM

Route 53 records are managed through a reusable `records` variable.

The variable supports:

- Standard records using `values`
- Alias records using `alias`

ACM DNS validation records are CNAME records and should be preserved while certificates are in use.

Do not confuse:

- ACM validation CNAME records
- Application DNS records such as API custom domain records
- Name server records for delegated hosted zones

## Import Policy

Existing AWS resources should be imported into Terraform before applying configuration.

Use import blocks when possible.

After import:

1. Run `terraform plan`
2. Investigate every difference
3. Do not blindly apply changes
4. Use `moved` blocks when only the Terraform resource address changed
5. Avoid destroying production resources

Expected differences must be explained before applying.

## Safety Rules

Before any destructive or replacement operation:

- Check the current Terraform plan
- Confirm the target environment
- Check whether data or users are affected
- Ask for confirmation if the impact is unclear

Never run:

```text
terraform destroy
```

without explicit approval.

Never modify production infrastructure based only on assumptions from staging.

## Working Style

Explain:

- Which Terraform resource is being changed
- Which AWS resource it represents
- Why the change is required
- Whether it causes replacement or in-place update
- Whether application downtime or data loss is possible

Prefer small, verifiable changes over broad refactoring.