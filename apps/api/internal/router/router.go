package router

import (
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/handler"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/middleware"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/repository"
	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/service"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/gorilla/mux"
)

func New(db *dynamodb.Client, config aws.Config) http.Handler {
	profileRepository := repository.NewProfileRepository(db)
	profileService := service.NewProfileService(profileRepository)
	profileHandler := handler.NewProfileHandler(profileService)
	skillRepository := repository.NewSkillRepository(db)
	skillService := service.NewSkillService(skillRepository)
	skillHandler := handler.NewSkillHandler(skillService)
	projectRepository := repository.NewProjectRepository(db)
	projectService := service.NewProjectService(projectRepository)
	imageUploadService := service.NewImageUploadService(config)
	projectHandler := handler.NewProjectHandler(projectService, imageUploadService)
	articleRepository := repository.NewArticleRepository(db)
	articleService := service.NewArticleService(articleRepository)
	articleHandler := handler.NewArticleHandler(articleService)
	careerRepository := repository.NewCareerRepository(db)
	careerService := service.NewCareerService(careerRepository)
	careerHandler := handler.NewCareerHandler(careerService)

	r := mux.NewRouter()
	r.Use(middleware.CORS)
	r.PathPrefix("/").Methods(http.MethodOptions).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})
	// mux's default NotFoundHandler/MethodNotAllowedHandler don't go through r.Use,
	// so an unmatched route would otherwise come back with no CORS headers and the
	// browser reports it as a CORS failure instead of a 404.
	r.NotFoundHandler = middleware.CORS(http.HandlerFunc(http.NotFound))
	r.MethodNotAllowedHandler = middleware.CORS(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}))

	r.HandleFunc("/health", handler.Health).Methods("GET")
	r.HandleFunc("/profile", profileHandler.GetProfile).Methods("GET")
	r.HandleFunc("/admin/profile", profileHandler.UpdateProfile).Methods("POST")
	r.HandleFunc("/skills", skillHandler.GetSkills).Methods("GET")
	r.HandleFunc("/admin/skills", skillHandler.UpdateSkills).Methods("POST")
	r.HandleFunc("/projects", projectHandler.ListPublicProjects).Methods("GET")
	r.HandleFunc("/admin/projects", projectHandler.ListProjects).Methods("GET")
	r.HandleFunc("/admin/projects", projectHandler.CreateProject).Methods("POST")
	r.HandleFunc("/admin/projects/{id}", projectHandler.GetProject).Methods("GET")
	r.HandleFunc("/admin/projects/{id}", projectHandler.UpdateProject).Methods("PUT")
	r.HandleFunc("/admin/projects/{id}", projectHandler.DeleteProject).Methods("DELETE")
	r.HandleFunc("/admin/projects/{id}/image-upload", projectHandler.CreateImageUploadURL).Methods("POST")
	r.HandleFunc("/articles", articleHandler.ListPublicArticles).Methods("GET")
	r.HandleFunc("/admin/articles", articleHandler.ListArticles).Methods("GET")
	r.HandleFunc("/admin/articles", articleHandler.CreateArticle).Methods("POST")
	r.HandleFunc("/admin/articles/{id}", articleHandler.GetArticle).Methods("GET")
	r.HandleFunc("/admin/articles/{id}", articleHandler.UpdateArticle).Methods("PUT")
	r.HandleFunc("/admin/articles/{id}", articleHandler.DeleteArticle).Methods("DELETE")
	r.HandleFunc("/careers", careerHandler.ListCareers).Methods("GET")
	r.HandleFunc("/admin/careers", careerHandler.ListCareers).Methods("GET")
	r.HandleFunc("/admin/careers", careerHandler.CreateCareer).Methods("POST")
	r.HandleFunc("/admin/careers/{id}", careerHandler.UpdateCareer).Methods("PUT")
	r.HandleFunc("/admin/careers/{id}", careerHandler.DeleteCareer).Methods("DELETE")

	return r
}
