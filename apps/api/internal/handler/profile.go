package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"sync"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
)

var (
	profileServiceOnce sync.Once
	profileService     *service.ProfileService
	profileServiceErr  error
)

func Profile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	profile, err := getProfileService(r.Context())
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	profileData, err := profile.GetProfile(r.Context())
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(profileData); err != nil {
		return
	}
}

func getProfileService(ctx context.Context) (*service.ProfileService, error) {
	profileServiceOnce.Do(func() {
		var awsConfig aws.Config
		awsConfig, profileServiceErr = config.LoadDefaultConfig(ctx)
		if profileServiceErr != nil {
			return
		}
		profileService = service.NewProfileService(awsConfig)
	})

	return profileService, profileServiceErr
}
