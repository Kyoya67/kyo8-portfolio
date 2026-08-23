package router

import (
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/handler"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/repository"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/gorilla/mux"
)

func New(db *dynamodb.Client) *mux.Router {
	profileRepository := repository.NewProfileRepository(db)
	profileService := service.NewProfileService(profileRepository)
	profileHandler := handler.NewProfileHandler(profileService)

	r := mux.NewRouter()
	r.HandleFunc("/health", handler.Health).Methods("GET")
	r.HandleFunc("/profile", profileHandler.GetProfile).Methods("GET")
	r.HandleFunc("/profile", profileHandler.UpdateProfile).Methods("POST")

	return r
}
