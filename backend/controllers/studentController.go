package controllers

import (
    "encoding/json"
    "net/http"
    "strconv"

    "fealtyx-student-api/models"
    "github.com/gorilla/mux"
)

var students = make(map[int]models.Student)
var currentID = 0

// Create a new student
func CreateStudent(w http.ResponseWriter, r *http.Request) {
    var student models.Student
    json.NewDecoder(r.Body).Decode(&student)

    if student.Name == "" || student.Email == "" || student.Age <= 0 {
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    currentID++
    student.ID = currentID
    students[student.ID] = student

    json.NewEncoder(w).Encode(student)
}

// Get all students
func GetStudents(w http.ResponseWriter, r *http.Request) {
    var allStudents []models.Student
    for _, student := range students {
        allStudents = append(allStudents, student)
    }

    json.NewEncoder(w).Encode(allStudents)
}

// Get a student by ID
func GetStudent(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    id, _ := strconv.Atoi(params["id"])

    student, exists := students[id]
    if !exists {
        http.Error(w, "Student not found", http.StatusNotFound)
        return
    }

    json.NewEncoder(w).Encode(student)
}

// Update a student by ID
func UpdateStudent(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    id, _ := strconv.Atoi(params["id"])

    var updatedStudent models.Student
    json.NewDecoder(r.Body).Decode(&updatedStudent)

    if updatedStudent.Name == "" || updatedStudent.Email == "" || updatedStudent.Age <= 0 {
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    student, exists := students[id]
    if !exists {
        http.Error(w, "Student not found", http.StatusNotFound)
        return
    }

    student.Name = updatedStudent.Name
    student.Age = updatedStudent.Age
    student.Email = updatedStudent.Email
    students[id] = student

    json.NewEncoder(w).Encode(student)
}

// Delete a student by ID
func DeleteStudent(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    id, _ := strconv.Atoi(params["id"])

    _, exists := students[id]
    if !exists {
        http.Error(w, "Student not found", http.StatusNotFound)
        return
    }

    delete(students, id)
    w.WriteHeader(http.StatusNoContent)
}
