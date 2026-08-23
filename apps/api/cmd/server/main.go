package main

import (
	"context"
	"log"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/router"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func main() {
	awsConfig, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	db := dynamodb.NewFromConfig(awsConfig)

	server := &http.Server{
		Addr:    ":8080",
		Handler: router.New(db),
	}

	log.Println("API server listening on :8080")
	log.Fatal(server.ListenAndServe())
}
