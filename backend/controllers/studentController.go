package controllers

import (
	"encoding/json"
	"fmt"
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
	err := json.NewDecoder(r.Body).Decode(&student)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		fmt.Println("Decoding error:", err)
		return
	}

	
	// Validation for required fields
	if student.Name == "" || student.Email == "" || student.Age <= 0 {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		fmt.Println("Validation error:", student)
		return
	}

	// Increment the ID and save the student
	currentID++
	student.ID = currentID
	students[student.ID] = student

	// Send the created student as a response
	json.NewEncoder(w).Encode(student)
	fmt.Println("Created student:", student)
}

// Get all students
func GetStudents(w http.ResponseWriter, r *http.Request) {
	fmt.Println("app is here")
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
	// Extract the ID from the URL parameters and convert it to an integer
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid student ID", http.StatusBadRequest)
		fmt.Println("Invalid ID:", params["id"])
		return
	}

	// Decode the updated student data from the request body
	var updatedStudent models.Student
	err = json.NewDecoder(r.Body).Decode(&updatedStudent)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		fmt.Println("Decoding error:", err)
		return
	}

	// Validate that the required fields are present
	if updatedStudent.Name == "" || updatedStudent.Email == "" || updatedStudent.Age <= 0 {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		fmt.Println("Validation error:", updatedStudent)
		return
	}

	// Check if the student exists
	student, exists := students[id]
	if !exists {
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}

	// Update the student data
	student.Name = updatedStudent.Name
	student.Age = updatedStudent.Age
	student.Email = updatedStudent.Email
	students[id] = student

	// Send the updated student as a response
	json.NewEncoder(w).Encode(student)
	fmt.Println("Updated student:", student)
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
