package model

type Skill struct {
	ID           string       `json:"id" dynamodbav:"id"`
	Name         string       `json:"name" dynamodbav:"name"`
	Category     string       `json:"category" dynamodbav:"category"`
	Order        int          `json:"order" dynamodbav:"order"`
	Capabilities []string     `json:"capabilities" dynamodbav:"capabilities"`
	Children     []SkillChild `json:"children" dynamodbav:"children"`
}

type SkillChild struct {
	ID           string   `json:"id" dynamodbav:"id"`
	Name         string   `json:"name" dynamodbav:"name"`
	Capabilities []string `json:"capabilities" dynamodbav:"capabilities"`
}
