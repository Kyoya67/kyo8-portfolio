package repository

import (
	"context"
	"errors"
	"testing"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

/*
 ******************************************************************************
 * Test Helpers
 * - fakeDynamo: DynamoDBへ接続せず、各操作の結果を再現すること
 * - assertRepositoryError: アプリケーションエラーコードを検証すること
 ******************************************************************************
 */
type fakeDynamo struct {
	getOutput  *dynamodb.GetItemOutput
	scanOutput *dynamodb.ScanOutput
	err        error
	putErr     error
	deleteErr  error
	putCheck   func(*dynamodb.PutItemInput)
}

func (f fakeDynamo) GetItem(context.Context, *dynamodb.GetItemInput, ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
	return f.getOutput, f.err
}
func (f fakeDynamo) Scan(context.Context, *dynamodb.ScanInput, ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
	return f.scanOutput, f.err
}
func (f fakeDynamo) PutItem(_ context.Context, input *dynamodb.PutItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
	if f.putCheck != nil {
		f.putCheck(input)
	}
	return &dynamodb.PutItemOutput{}, f.putErr
}
func (f fakeDynamo) DeleteItem(context.Context, *dynamodb.DeleteItemInput, ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
	return &dynamodb.DeleteItemOutput{}, f.deleteErr
}

func assertRepositoryError(t *testing.T, err error, code apperrors.ErrCode) {
	t.Helper()
	if err == nil {
		t.Fatal("error = nil, want error")
	}
	var appErr *apperrors.Error
	if !errors.As(err, &appErr) {
		t.Fatalf("error type = %T", err)
	}
	if appErr.ErrCode != string(code) {
		t.Errorf("ErrCode = %q, want %q", appErr.ErrCode, code)
	}
}
