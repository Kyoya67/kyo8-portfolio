package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/mock"
)

func Profile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(mock.Profile()); err != nil {
		return
	}
}
