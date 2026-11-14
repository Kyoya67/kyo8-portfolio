package router

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

type certificationStore struct {
	routerDynamoFake
	items map[string]map[string]types.AttributeValue
}

func (s *certificationStore) Scan(_ context.Context, in *dynamodb.ScanInput, _ ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
	out := &dynamodb.ScanOutput{}
	for _, item := range s.items {
		out.Items = append(out.Items, item)
	}
	return out, nil
}
func (s *certificationStore) PutItem(_ context.Context, in *dynamodb.PutItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
	s.items[in.Item["id"].(*types.AttributeValueMemberS).Value] = in.Item
	return &dynamodb.PutItemOutput{}, nil
}
func (s *certificationStore) DeleteItem(_ context.Context, in *dynamodb.DeleteItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
	delete(s.items, in.Key["id"].(*types.AttributeValueMemberS).Value)
	return &dynamodb.DeleteItemOutput{}, nil
}
func TestCertificationCRUD(t *testing.T) {
	db := &certificationStore{items: map[string]map[string]types.AttributeValue{}}
	router := New(db)
	request := func(method, path, body string, want int) *httptest.ResponseRecorder {
		t.Helper()
		w := httptest.NewRecorder()
		router.ServeHTTP(w, httptest.NewRequest(method, path, strings.NewReader(body)))
		if w.Code != want {
			t.Fatalf("%s %s status %d: %s", method, path, w.Code, w.Body)
		}
		return w
	}
	if body := request("GET", "/certifications", "", 200).Body.String(); strings.TrimSpace(body) != "[]" {
		t.Fatal(body)
	}
	valid := `{"id":"saa","name":{"en":"SAA","ja":"SAA"},"issuer":"AWS","acquiredDate":"2026-10","order":1}`
	request("POST", "/admin/certifications", valid, 204)
	if body := request("GET", "/certifications", "", 200).Body.String(); !strings.Contains(body, `"issuer":"AWS"`) {
		t.Fatal(body)
	}
	// URL identity must override a conflicting body ID.
	request("PUT", "/admin/certifications/saa", strings.Replace(valid, `"id":"saa"`, `"id":"other"`, 1), 204)
	if len(db.items) != 1 || db.items["saa"] == nil {
		t.Fatal("update changed record identity")
	}
	request("POST", "/admin/certifications", `{"id":"bad"}`, 400)
	request("POST", "/admin/certifications", "invalid", 400)
	request("DELETE", "/admin/certifications/saa", "", 204)
	if len(db.items) != 0 {
		t.Fatal("record was not deleted")
	}
	if body := request(http.MethodGet, "/certifications", "", 200).Body.String(); strings.TrimSpace(body) != "[]" {
		t.Fatal("deleted certification reappeared: " + body)
	}
}
func TestCertificationTableEnvironment(t *testing.T) {
	t.Setenv("CERTIFICATION_TABLE_NAME", "")
	t.Setenv("CAREER_TABLE_NAME", "career-prd")
	if got := certificationTableName(); got != "certification-prd" {
		t.Fatal(got)
	}
	t.Setenv("CERTIFICATION_TABLE_NAME", "custom-certifications")
	if got := certificationTableName(); got != "custom-certifications" {
		t.Fatal(got)
	}
}
