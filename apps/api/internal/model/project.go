package model

type Project struct {
	ID            string        `json:"id" dynamodbav:"id"`
	Slug          string        `json:"slug" dynamodbav:"slug"`
	Title         LocalizedText `json:"title" dynamodbav:"title"`
	Summary       LocalizedText `json:"summary" dynamodbav:"summary"`
	Description   LocalizedText `json:"description" dynamodbav:"description"`
	Graphic       string        `json:"graphic" dynamodbav:"graphic"`
	RepositoryURL string        `json:"repositoryUrl" dynamodbav:"repositoryUrl"`
	WebsiteURL    *string       `json:"websiteUrl" dynamodbav:"websiteUrl"`
	Technologies  []string      `json:"technologies" dynamodbav:"technologies"`
	Featured      bool          `json:"featured" dynamodbav:"featured"`
	Published     bool          `json:"published" dynamodbav:"published"`
	Order         int           `json:"order" dynamodbav:"order"`
	Year          string        `json:"year" dynamodbav:"year"`
}
