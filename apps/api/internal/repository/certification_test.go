package repository

import (
	"context"
	"errors"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/apperrors"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"testing"
)

type certificationDynamoFake struct {
	fakeDynamo
	pages []*dynamodb.ScanOutput
	calls int
	t     *testing.T
}

func (f *certificationDynamoFake) Scan(_ context.Context, in *dynamodb.ScanInput, _ ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
	if *in.TableName != "certification-test" {
		f.t.Fatal("incorrect table")
	}
	if f.calls > 0 && len(in.ExclusiveStartKey) == 0 {
		f.t.Fatal("missing pagination cursor")
	}
	out := f.pages[f.calls]
	f.calls++
	return out, nil
}
func TestCertificationListPaginationAndOrder(t *testing.T) {
	item := func(id, order string) map[string]types.AttributeValue {
		return map[string]types.AttributeValue{"id": &types.AttributeValueMemberS{Value: id}, "order": &types.AttributeValueMemberN{Value: order}}
	}
	db := &certificationDynamoFake{t: t, pages: []*dynamodb.ScanOutput{
		{Items: []map[string]types.AttributeValue{item("b", "2")}, LastEvaluatedKey: map[string]types.AttributeValue{"id": &types.AttributeValueMemberS{Value: "b"}}},
		{Items: []map[string]types.AttributeValue{item("c", "1"), item("a", "1")}},
	}}
	got, err := NewCertificationRepository(db, "certification-test").ListCertifications(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if db.calls != 2 || len(got) != 3 || got[0].ID != "a" || got[1].ID != "c" || got[2].ID != "b" {
		t.Fatalf("unexpected order/pages: %+v, calls %d", got, db.calls)
	}
}
func TestCertificationListEmptyAndErrors(t *testing.T) {
	got, err := NewCertificationRepository(fakeDynamo{scanOutput: &dynamodb.ScanOutput{}}, "certification-test").ListCertifications(context.Background())
	if err != nil || got == nil || len(got) != 0 {
		t.Fatalf("empty table must return [], got %+v, %v", got, err)
	}
	_, err = NewCertificationRepository(fakeDynamo{err: errors.New("down")}, "certification-test").ListCertifications(context.Background())
	assertRepositoryError(t, err, apperrors.DependencyUnavailable)
	_, err = NewCertificationRepository(fakeDynamo{scanOutput: &dynamodb.ScanOutput{Items: []map[string]types.AttributeValue{{"name": &types.AttributeValueMemberS{Value: "invalid"}}}}}, "certification-test").ListCertifications(context.Background())
	assertRepositoryError(t, err, apperrors.DataMappingFailed)
}
