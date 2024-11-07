package main

import (
    "log"
    "net/http"

    "fealtyx-student-api/routes"
    "github.com/gorilla/mux"
)

// CORS Middleware
func enableCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        // Handle preflight OPTIONS request
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
        }

        next.ServeHTTP(w, r)
    })
}

func main() {
    router := mux.NewRouter()
    routes.RegisterStudentRoutes(router)

    // Wrap router with CORS middleware
    corsRouter := enableCORS(router)

    log.Println("Starting server on :8080")
    log.Fatal(http.ListenAndServe(":8080", corsRouter))
}
