package main

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/router"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handler(
	ctx context.Context,
	request events.APIGatewayV2HTTPRequest,
) (events.APIGatewayV2HTTPResponse, error) {
	var requestBody io.ReadCloser = http.NoBody
	if request.Body != "" {
		requestBody = io.NopCloser(strings.NewReader(request.Body))
	}

	httpRequest, err := http.NewRequestWithContext(
		ctx,
		request.RequestContext.HTTP.Method,
		request.RequestContext.HTTP.Path,
		requestBody,
	)
	if err != nil {
		return events.APIGatewayV2HTTPResponse{}, err
	}

	for key, value := range request.Headers {
		httpRequest.Header.Set(key, value)
	}

	recorder := httptest.NewRecorder()
	router.New().ServeHTTP(recorder, httpRequest)

	responseHeaders := make(map[string]string, len(recorder.Header()))
	for key, values := range recorder.Header() {
		if len(values) > 0 {
			responseHeaders[key] = values[0]
		}
	}

	return events.APIGatewayV2HTTPResponse{
		StatusCode: recorder.Code,
		Headers:    responseHeaders,
		Body:       recorder.Body.String(),
	}, nil
}

func main() {
	lambda.Start(handler)
}
