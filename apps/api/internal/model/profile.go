package model

type LocalizedText struct {
	EN string `json:"en" dynamodbav:"en"`
	JA string `json:"ja" dynamodbav:"ja"`
}

type Profile struct {
	Name        string        `json:"name" dynamodbav:"name"`
	Handle      string        `json:"handle" dynamodbav:"handle"`
	Headline    LocalizedText `json:"headline" dynamodbav:"headline"`
	Bio         LocalizedText `json:"bio" dynamodbav:"bio"`
	Location    LocalizedText `json:"location" dynamodbav:"location"`
	Focus       []string      `json:"focus" dynamodbav:"focus"`
	GitHubURL   string        `json:"githubUrl" dynamodbav:"githubUrl"`
	LinkedInURL *string       `json:"linkedinUrl" dynamodbav:"linkedinUrl"`
	XURL        *string       `json:"xUrl" dynamodbav:"xUrl"`
	Email       *string       `json:"email" dynamodbav:"email"`
}
