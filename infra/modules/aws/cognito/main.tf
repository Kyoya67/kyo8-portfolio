resource "aws_cognito_user_pool" "main" {
  name                     = "kyo8-portfolio-${var.env}"
  auto_verified_attributes = ["email"]
  deletion_protection      = "ACTIVE"
  mfa_configuration        = "OFF"
  user_pool_tier           = "ESSENTIALS"
  username_attributes      = ["email"]
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }
  admin_create_user_config {
    allow_admin_create_user_only = true
  }
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
  sign_in_policy {
    allowed_first_auth_factors = ["PASSWORD", "WEB_AUTHN"]
  }
  username_configuration {
    case_sensitive = false
  }
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }
  web_authn_configuration {
    user_verification = "preferred"
  }
}

resource "aws_cognito_user_pool_client" "admin_spa" {
  name                                 = "kyo8-portfolio-admin-spa-${var.env}"
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["email", "openid", "phone"]
  auth_session_validity                = 3
  callback_urls                        = [for url in var.urls : "${url}/callback"]
  enable_token_revocation              = true
  explicit_auth_flows                  = ["ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_AUTH"]
  logout_urls                          = [for url in var.urls : "${url}/login"]
  refresh_token_validity               = 30
  supported_identity_providers         = ["COGNITO"]
  user_pool_id                         = aws_cognito_user_pool.main.id
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "ap-northeast-1exwfox41t"
  user_pool_id = aws_cognito_user_pool.main.id
}
