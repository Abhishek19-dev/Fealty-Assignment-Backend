package routes

import (
    "fealtyx-student-api/controllers"
    "github.com/gorilla/mux"
)

func RegisterStudentRoutes(router *mux.Router) {
    router.HandleFunc("/students", controllers.CreateStudent).Methods("POST")
    router.HandleFunc("/students", controllers.GetStudents).Methods("GET")
    router.HandleFunc("/students/{id}", controllers.GetStudent).Methods("GET")
    router.HandleFunc("/students/{id}", controllers.UpdateStudent).Methods("PUT")
    router.HandleFunc("/students/{id}", controllers.DeleteStudent).Methods("DELETE")
    router.HandleFunc("/students/{id}/summary", controllers.GenerateSummary).Methods("GET")
}
