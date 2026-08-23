package middleware

import "net/http"

var allowedOrigins = map[string]bool{
	"https://kyo8.dev":           true,
	"https://admin.kyo8.dev":     true,
	"https://stg.kyo8.dev":       true,
	"https://admin.stg.kyo8.dev": true,
	"http://localhost:3000":      true,
	"http://localhost:3001":      true,
}

func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Vary", "Origin")
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
