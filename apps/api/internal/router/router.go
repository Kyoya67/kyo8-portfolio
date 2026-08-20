package router

import (
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/handler"
)

func New() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", handler.Health)

	return mux
}
