package repository

import (
	"context"
	"errors"
	"net"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/aws/smithy-go"
)

// classifyDynamoError converts DynamoDB and transport errors into application errors.
func classifyDynamoError(err error) error {
	if errors.Is(err, context.Canceled) {
		return err
	}

	if errors.Is(err, context.DeadlineExceeded) {
		return apperrors.Timeout.Wrap(err, "DynamoDB request timed out")
	}

	var resourceNotFound *types.ResourceNotFoundException
	if errors.As(err, &resourceNotFound) {
		return apperrors.DependencyConfigError.Wrap(err, "DynamoDB table is not configured correctly")
	}

	var throttled *types.ProvisionedThroughputExceededException
	if errors.As(err, &throttled) {
		return apperrors.DependencyThrottled.Wrap(err, "DynamoDB request was throttled")
	}

	var requestLimitExceeded *types.RequestLimitExceeded
	if errors.As(err, &requestLimitExceeded) {
		return apperrors.DependencyThrottled.Wrap(err, "DynamoDB request limit was exceeded")
	}

	var throttling *types.ThrottlingException
	if errors.As(err, &throttling) {
		return apperrors.DependencyThrottled.Wrap(err, "DynamoDB request was throttled")
	}

	var apiErr smithy.APIError
	if errors.As(err, &apiErr) {
		switch apiErr.ErrorCode() {
		case "AccessDeniedException", "UnrecognizedClientException", "InvalidSignatureException":
			return apperrors.DependencyAuthFailed.Wrap(err, "DynamoDB authentication failed")
		}
	}

	var netErr net.Error
	if errors.As(err, &netErr) && netErr.Timeout() {
		return apperrors.DependencyUnavailable.Wrap(err, "DynamoDB is unavailable")
	}

	return apperrors.DependencyUnavailable.Wrap(err, "DynamoDB request failed")
}
