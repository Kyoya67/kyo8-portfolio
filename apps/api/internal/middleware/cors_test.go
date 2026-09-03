package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

func TestCORSAllowedOrigin(t *testing.T) {
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusTeapot)
	})

	req := httptest.NewRequest(http.MethodGet, "/profile", nil)
	req.Header.Set("Origin", "https://admin.stg.kyo8.dev")
	recorder := httptest.NewRecorder()

	CORS(next).ServeHTTP(recorder, req)

	if recorder.Code != http.StatusTeapot {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusTeapot)
	}
	if got := recorder.Header().Get("Access-Control-Allow-Origin"); got != "https://admin.stg.kyo8.dev" {
		t.Fatalf("allow-origin = %q, want %q", got, "https://admin.stg.kyo8.dev")
	}
}

func TestCORSDisallowedOrigin(t *testing.T) {
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusTeapot)
	})

	req := httptest.NewRequest(http.MethodGet, "/profile", nil)
	req.Header.Set("Origin", "https://docs.google.com")
	recorder := httptest.NewRecorder()

	CORS(next).ServeHTTP(recorder, req)

	if recorder.Code != http.StatusTeapot {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusTeapot)
	}
	if got := recorder.Header().Get("Access-Control-Allow-Origin"); got != "" {
		t.Fatalf("allow-origin = %q, want empty", got)
	}
}

func TestCORSOptionsStopsNextHandler(t *testing.T) {
	nextCalled := false
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCalled = true
		w.WriteHeader(http.StatusTeapot)
	})

	req := httptest.NewRequest(http.MethodOptions, "/admin/projects/p01", nil)
	req.Header.Set("Origin", "https://admin.stg.kyo8.dev")
	req.Header.Set("Access-Control-Request-Method", http.MethodDelete)
	recorder := httptest.NewRecorder()

	CORS(next).ServeHTTP(recorder, req)

	if recorder.Code != http.StatusNoContent {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusNoContent)
	}
	if nextCalled {
		t.Fatal("next handler was called for OPTIONS request")
	}
	if got := recorder.Header().Get("Access-Control-Allow-Origin"); got != "https://admin.stg.kyo8.dev" {
		t.Fatalf("allow-origin = %q, want %q", got, "https://admin.stg.kyo8.dev")
	}
}

func TestCORSNotFoundHandler(t *testing.T) {
	r := mux.NewRouter()
	r.Use(CORS)
	r.NotFoundHandler = CORS(http.HandlerFunc(http.NotFound))
	r.HandleFunc("/profile", func(w http.ResponseWriter, r *http.Request) {}).Methods(http.MethodGet)

	req := httptest.NewRequest(http.MethodGet, "/not-found", nil)
	req.Header.Set("Origin", "https://admin.stg.kyo8.dev")
	recorder := httptest.NewRecorder()

	r.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusNotFound)
	}
	if got := recorder.Header().Get("Access-Control-Allow-Origin"); got != "https://admin.stg.kyo8.dev" {
		t.Fatalf("allow-origin = %q, want %q", got, "https://admin.stg.kyo8.dev")
	}
}

func TestCORSMethodNotAllowedHandler(t *testing.T) {
	r := mux.NewRouter()
	r.Use(CORS)
	r.MethodNotAllowedHandler = CORS(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}))
	r.HandleFunc("/profile", func(w http.ResponseWriter, r *http.Request) {}).Methods(http.MethodGet)

	req := httptest.NewRequest(http.MethodPost, "/profile", nil)
	req.Header.Set("Origin", "https://admin.stg.kyo8.dev")
	recorder := httptest.NewRecorder()

	r.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusMethodNotAllowed)
	}
	if got := recorder.Header().Get("Access-Control-Allow-Origin"); got != "https://admin.stg.kyo8.dev" {
		t.Fatalf("allow-origin = %q, want %q", got, "https://admin.stg.kyo8.dev")
	}
}
