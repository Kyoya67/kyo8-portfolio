package main

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/router"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func newHandler(db *dynamodb.Client, awsConfig aws.Config) func(
	ctx context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	apiRouter := router.New(db, awsConfig)

	return func(
		ctx context.Context,
		request events.APIGatewayProxyRequest,
	) (events.APIGatewayProxyResponse, error) {
		var requestBody io.ReadCloser = http.NoBody
		if request.Body != "" {
			requestBody = io.NopCloser(strings.NewReader(request.Body))
		}

		httpRequest, err := http.NewRequestWithContext(
			ctx,
			request.HTTPMethod,
			request.Path,
			requestBody,
		)
		if err != nil {
			return events.APIGatewayProxyResponse{}, err
		}

		query := url.Values{}
		for key, value := range request.QueryStringParameters {
			query.Set(key, value)
		}
		httpRequest.URL.RawQuery = query.Encode()

		for key, value := range request.Headers {
			httpRequest.Header.Set(key, value)
		}

		recorder := httptest.NewRecorder()
		apiRouter.ServeHTTP(recorder, httpRequest)

		responseHeaders := make(map[string]string, len(recorder.Header()))
		for key, values := range recorder.Header() {
			if len(values) > 0 {
				responseHeaders[key] = values[0]
			}
		}

		return events.APIGatewayProxyResponse{
			StatusCode: recorder.Code,
			Headers:    responseHeaders,
			Body:       recorder.Body.String(),
		}, nil
	}
}

func main() {
	awsConfig, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}

	db := dynamodb.NewFromConfig(awsConfig)

	lambda.Start(newHandler(db, awsConfig))
}
