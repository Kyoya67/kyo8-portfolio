package repository

import (
	"context"
	"errors"
	"net"
	"testing"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/aws/smithy-go"
)

type timeoutError struct{}

func (timeoutError) Error() string   { return "timeout" }
func (timeoutError) Timeout() bool   { return true }
func (timeoutError) Temporary() bool { return true }

var _ net.Error = timeoutError{}

func TestClassifyDynamoError(t *testing.T) {
	t.Run("returns context canceled unchanged", func(t *testing.T) {
		got := classifyDynamoError(context.Canceled)
		if !errors.Is(got, context.Canceled) {
			t.Errorf("error = %v", got)
		}
	})
	t.Run("classifies deadline exceeded as Timeout", func(t *testing.T) {
		assertDynamoErrorCode(t, context.DeadlineExceeded, apperrors.Timeout)
	})
	t.Run("classifies missing table as DependencyConfigError", func(t *testing.T) {
		assertDynamoErrorCode(t, &types.ResourceNotFoundException{}, apperrors.DependencyConfigError)
	})
	t.Run("classifies provisioned throughput as DependencyThrottled", func(t *testing.T) {
		assertDynamoErrorCode(t, &types.ProvisionedThroughputExceededException{}, apperrors.DependencyThrottled)
	})
	t.Run("classifies request limit as DependencyThrottled", func(t *testing.T) {
		assertDynamoErrorCode(t, &types.RequestLimitExceeded{}, apperrors.DependencyThrottled)
	})
	t.Run("classifies throttling as DependencyThrottled", func(t *testing.T) {
		assertDynamoErrorCode(t, &types.ThrottlingException{}, apperrors.DependencyThrottled)
	})
	t.Run("classifies access denied as DependencyAuthFailed", func(t *testing.T) {
		assertDynamoErrorCode(t, smithyTestAPIError{code: "AccessDeniedException"}, apperrors.DependencyAuthFailed)
	})
	t.Run("classifies network timeout as DependencyUnavailable", func(t *testing.T) {
		assertDynamoErrorCode(t, timeoutError{}, apperrors.DependencyUnavailable)
	})
	t.Run("classifies unknown error as DependencyUnavailable", func(t *testing.T) {
		assertDynamoErrorCode(t, errors.New("unknown"), apperrors.DependencyUnavailable)
	})
}

func assertDynamoErrorCode(t *testing.T, err error, code apperrors.ErrCode) {
	t.Helper()
	got := classifyDynamoError(err)
	var appErr *apperrors.Error
	if !errors.As(got, &appErr) {
		t.Fatalf("error type = %T", got)
	}
	if appErr.ErrCode != string(code) {
		t.Errorf("code = %q, want %q", appErr.ErrCode, code)
	}
}

type smithyTestAPIError struct{ code string }

func (e smithyTestAPIError) Error() string                 { return e.code }
func (e smithyTestAPIError) ErrorCode() string             { return e.code }
func (e smithyTestAPIError) ErrorMessage() string          { return e.code }
func (e smithyTestAPIError) ErrorFault() smithy.ErrorFault { return smithy.FaultUnknown }
