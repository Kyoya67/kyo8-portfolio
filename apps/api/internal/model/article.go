package model

type Article struct {
	ID          string        `json:"id" dynamodbav:"id"`
	Slug        *string       `json:"slug" dynamodbav:"slug"`
	Title       LocalizedText `json:"title" dynamodbav:"title"`
	Summary     LocalizedText `json:"summary" dynamodbav:"summary"`
	Body        LocalizedText `json:"body" dynamodbav:"body"`
	URL         string        `json:"url" dynamodbav:"url"`
	Source      string        `json:"source" dynamodbav:"source"`
	SourceLabel string        `json:"sourceLabel" dynamodbav:"sourceLabel"`
	PublishedAt string        `json:"publishedAt" dynamodbav:"publishedAt"`
	Published   bool          `json:"published" dynamodbav:"published"`
	Order       int           `json:"order" dynamodbav:"order"`
}
