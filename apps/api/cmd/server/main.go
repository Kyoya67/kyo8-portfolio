package main

import (
	"log"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/router"
)

func main() {
	server := &http.Server{
		Addr:    ":8080",
		Handler: router.New(),
	}

	log.Println("API server listening on :8080")
	log.Fatal(server.ListenAndServe())
}
