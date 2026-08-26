package main

import (
	"context"
	"log"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/repository"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func newHandler(zennService *service.ZennService) func(context.Context) error {
	return func(ctx context.Context) error {
		count, err := zennService.SyncArticles(ctx)
		if err != nil {
			log.Printf("Zenn article sync failed: error=%v", err)
			return err
		}

		log.Printf("Zenn article sync succeeded: synced=%d", count)
		return nil
	}
}

func main() {
	awsConfig, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		log.Fatalf("load AWS config: %v", err)
	}

	db := dynamodb.NewFromConfig(awsConfig)
	articleRepository := repository.NewArticleRepository(db)
	zennService := service.NewZennService(articleRepository)

	lambda.Start(newHandler(zennService))
}
