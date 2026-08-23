package model

type Career struct {
	ID           string        `json:"id" dynamodbav:"id"`
	Type         string        `json:"type" dynamodbav:"type"`
	Organization string        `json:"organization" dynamodbav:"organization"`
	Position     LocalizedText `json:"position" dynamodbav:"position"`
	StartDate    string        `json:"startDate" dynamodbav:"startDate"`
	EndDate      *string       `json:"endDate" dynamodbav:"endDate"`
	Description  LocalizedText `json:"description" dynamodbav:"description"`
	Note         string        `json:"note" dynamodbav:"note"`
	Order        int           `json:"order" dynamodbav:"order"`
}
