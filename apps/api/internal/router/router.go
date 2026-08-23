package router

import (
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/handler"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/middleware"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/repository"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/gorilla/mux"
)

func New(db *dynamodb.Client) http.Handler {
	profileRepository := repository.NewProfileRepository(db)
	profileService := service.NewProfileService(profileRepository)
	profileHandler := handler.NewProfileHandler(profileService)

	r := mux.NewRouter()
	r.Use(middleware.CORS)
	r.PathPrefix("/").Methods(http.MethodOptions).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})

	r.HandleFunc("/health", handler.Health).Methods("GET")
	r.HandleFunc("/profile", profileHandler.GetProfile).Methods("GET")
	r.HandleFunc("/admin/profile", profileHandler.UpdateProfile).Methods("POST")

	return r
}
