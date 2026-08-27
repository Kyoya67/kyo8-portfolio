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

	skillRepository := repository.NewSkillRepository(db)
	skillService := service.NewSkillService(skillRepository)
	skillHandler := handler.NewSkillHandler(skillService)

	projectRepository := repository.NewProjectRepository(db)
	projectService := service.NewProjectService(projectRepository)
	projectHandler := handler.NewProjectHandler(projectService)

	articleRepository := repository.NewArticleRepository(db)
	articleService := service.NewArticleService(articleRepository)
	zennService := service.NewZennService(articleRepository)
	articleHandler := handler.NewArticleHandler(articleService, zennService)

	careerRepository := repository.NewCareerRepository(db)
	careerService := service.NewCareerService(careerRepository)
	careerHandler := handler.NewCareerHandler(careerService)

	r := mux.NewRouter()
	r.Use(middleware.CORS)

	r.HandleFunc("/health", handler.Health).Methods("GET")

	r.HandleFunc("/profile", profileHandler.GetProfile).Methods("GET")
	r.HandleFunc("/admin/profile", profileHandler.UpdateProfile).Methods("POST")

	r.HandleFunc("/skills", skillHandler.GetSkills).Methods("GET")
	r.HandleFunc("/admin/skills", skillHandler.UpdateSkills).Methods("POST")

	r.HandleFunc("/projects", projectHandler.ListProjects).Methods("GET")
	r.HandleFunc("/projects/{id}", projectHandler.GetProject).Methods("GET")
	r.HandleFunc("/admin/projects", projectHandler.CreateProject).Methods("POST")
	r.HandleFunc("/admin/projects/{id}", projectHandler.UpdateProject).Methods("PUT")
	r.HandleFunc("/admin/projects/{id}", projectHandler.DeleteProject).Methods("DELETE")

	r.HandleFunc("/articles", articleHandler.ListArticles).Methods("GET")
	r.HandleFunc("/articles/{id}", articleHandler.GetArticle).Methods("GET")
	r.HandleFunc("/admin/articles", articleHandler.CreateArticle).Methods("POST")
	r.HandleFunc("/admin/articles/sync-zenn", articleHandler.SyncZennArticles).Methods("POST")
	r.HandleFunc("/admin/articles/{id}", articleHandler.UpdateArticle).Methods("PUT")
	r.HandleFunc("/admin/articles/{id}", articleHandler.DeleteArticle).Methods("DELETE")

	r.HandleFunc("/careers", careerHandler.ListCareers).Methods("GET")
	r.HandleFunc("/admin/careers", careerHandler.CreateCareer).Methods("POST")
	r.HandleFunc("/admin/careers/{id}", careerHandler.UpdateCareer).Methods("PUT")
	r.HandleFunc("/admin/careers/{id}", careerHandler.DeleteCareer).Methods("DELETE")

	return r
}
