package service

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type ImageUploadService struct {
	presigner *s3.PresignClient
	bucket    string
	region    string
	baseURL   string
}

type ImageUpload struct {
	ContentType string `json:"contentType"`
	Extension   string `json:"extension"`
}

type ImageUploadResponse struct {
	UploadURL string `json:"uploadUrl"`
	ImageURL  string `json:"imageUrl"`
	ImageKey  string `json:"imageKey"`
}

func NewImageUploadService(config aws.Config) *ImageUploadService {
	return &ImageUploadService{
		presigner: s3.NewPresignClient(s3.NewFromConfig(config)),
		bucket:    os.Getenv("PROJECT_IMAGE_BUCKET"),
		region:    config.Region,
		baseURL:   strings.TrimRight(os.Getenv("PROJECT_IMAGE_PUBLIC_BASE_URL"), "/"),
	}
}

func (s *ImageUploadService) CreateUploadURL(ctx context.Context, projectID string, input ImageUpload) (ImageUploadResponse, error) {
	if s.bucket == "" || projectID == "" || input.ContentType == "" {
		return ImageUploadResponse{}, fmt.Errorf("image upload configuration or input is invalid")
	}
	ext := strings.TrimPrefix(filepath.Ext(input.Extension), ".")
	if ext == "" {
		ext = "bin"
	}
	key := fmt.Sprintf("projects/%s/%d.%s", projectID, time.Now().UnixNano(), ext)
	presigned, err := s.presigner.PresignPutObject(ctx, &s3.PutObjectInput{Bucket: aws.String(s.bucket), Key: aws.String(key), ContentType: aws.String(input.ContentType)}, s3.WithPresignExpires(15*time.Minute))
	if err != nil {
		return ImageUploadResponse{}, fmt.Errorf("presign image upload: %w", err)
	}
	imageURL := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", s.bucket, s.region, key)
	if s.baseURL != "" {
		imageURL = s.baseURL + "/" + key
	}
	return ImageUploadResponse{UploadURL: presigned.URL, ImageURL: imageURL, ImageKey: key}, nil
}
