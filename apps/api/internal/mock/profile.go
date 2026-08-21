package mock

type LocalizedText struct {
	EN string `json:"en"`
	JA string `json:"ja"`
}

type ProfileResponse struct {
	Name        string        `json:"name"`
	Handle      string        `json:"handle"`
	Headline    LocalizedText `json:"headline"`
	Bio         LocalizedText `json:"bio"`
	Location    LocalizedText `json:"location"`
	Focus       []string      `json:"focus"`
	GitHubURL   string        `json:"githubUrl"`
	LinkedInURL *string       `json:"linkedinUrl"`
	XURL        *string       `json:"xUrl"`
	Email       *string       `json:"email"`
}

func Profile() ProfileResponse {
	return ProfileResponse{
		Name:   "Kyoya",
		Handle: "KYO8",
		Headline: LocalizedText{
			EN: "KYO8\nBackend \nInfrastructure Engineer",
			JA: "KYO8\nバックエンド \nインフラエンジニア",
		},
		Bio: LocalizedText{
			EN: "Centering around Go, TypeScript, and AWS, I am deepening my understanding of underlying technologies that support systems, such as Linux, networking, and distributed systems.\n\nIn the long term, I aim to connect this knowledge with my experience in blockchain development to contribute to core protocol and infrastructure development for distributed systems, including Ethereum.",
			JA: "Go / TypeScript、AWSを軸に、Linuxやネットワーク、分散システムなど、システムを支える基盤技術への理解を深めています。\n\n長期的には、これらの知識とブロックチェーン開発の経験をつなげ、Ethereumをはじめとする分散システムの基盤開発に携わることを目指しています。",
		},
		Location:    LocalizedText{EN: "Tokyo", JA: "東京"},
		Focus:       []string{"Go", "AWS", "Blockchain", "Low-level Systems"},
		GitHubURL:   "https://github.com/",
		LinkedInURL: stringPointer("https://linkedin.com/"),
		XURL:        stringPointer("https://x.com/"),
		Email:       stringPointer("mailto:hello@kyo8.dev"),
	}
}

func stringPointer(value string) *string {
	return &value
}
