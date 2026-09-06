package router

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type routerDynamoFake struct{}

func (routerDynamoFake) GetItem(context.Context, *dynamodb.GetItemInput, ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
	return &dynamodb.GetItemOutput{}, nil
}
func (routerDynamoFake) Scan(context.Context, *dynamodb.ScanInput, ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
	return &dynamodb.ScanOutput{}, nil
}
func (routerDynamoFake) PutItem(context.Context, *dynamodb.PutItemInput, ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
	return &dynamodb.PutItemOutput{}, nil
}
func (routerDynamoFake) DeleteItem(context.Context, *dynamodb.DeleteItemInput, ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
	return &dynamodb.DeleteItemOutput{}, nil
}

/*
 ******************************************************************************
 * New
 * - 登録済みのHealthルートへ正常に到達できること
 * - 未登録のパスに404を返すこと
 * - 登録済みルートに異なるHTTPメソッドでアクセスした場合に405を返すこと
 ******************************************************************************
 */
func TestNew(t *testing.T) {
	router := New(routerDynamoFake{})

	t.Run("routes GET health request", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodGet, "/health", nil)
		router.ServeHTTP(recorder, request)
		if recorder.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", recorder.Code, http.StatusOK)
		}
	})

	t.Run("returns 404 for an unknown path", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodGet, "/unknown", nil)
		router.ServeHTTP(recorder, request)
		if recorder.Code != http.StatusNotFound {
			t.Errorf("status = %d, want %d", recorder.Code, http.StatusNotFound)
		}
	})

	t.Run("returns 405 for an unsupported method", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodPost, "/health", nil)
		router.ServeHTTP(recorder, request)
		if recorder.Code != http.StatusMethodNotAllowed {
			t.Errorf("status = %d, want %d", recorder.Code, http.StatusMethodNotAllowed)
		}
	})
}
