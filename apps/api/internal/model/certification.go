package model

type Certification struct {
	ID           string        `json:"id" dynamodbav:"id"`
	Name         LocalizedText `json:"name" dynamodbav:"name"`
	Issuer       string        `json:"issuer" dynamodbav:"issuer"`
	AcquiredDate string        `json:"acquiredDate" dynamodbav:"acquiredDate"`
	Order        int           `json:"order" dynamodbav:"order"`
}
