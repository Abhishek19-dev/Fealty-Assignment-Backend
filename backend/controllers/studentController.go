package controllers

import (
    "bytes"
	"encoding/json"
	"fmt"
    "io/ioutil"
	"net/http"
	"strconv"

	"fealtyx-student-api/models"
	"github.com/gorilla/mux"
)

var students = make(map[int]models.Student)
var currentID = 0

// Create a new student
func CreateStudent(w http.ResponseWriter, r *http.Request) {
	var studentData map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&studentData)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		fmt.Println("Decoding error:", err)
		return
	}

	// Check if the required fields exist
	name, ok := studentData["Name"].(string)
	if !ok || name == "" {
		http.Error(w, "Missing or invalid Name", http.StatusBadRequest)
		return
	}

	email, ok := studentData["Email"].(string)
	if !ok || email == "" {
		http.Error(w, "Missing or invalid Email", http.StatusBadRequest)
		return
	}

	// Handle Age which might be a string or integer
	var age int
	ageField, ok := studentData["Age"]
	if !ok || ageField == "" {
		http.Error(w, "Missing or invalid Age", http.StatusBadRequest)
		return
	}

	// Check if Age is a string and try converting it to an integer
	switch v := ageField.(type) {
	case string:
		convertedAge, err := strconv.Atoi(v)
		if err != nil {
			http.Error(w, "Invalid Age format", http.StatusBadRequest)
			fmt.Println("Error converting Age:", err)
			return
		}
		age = convertedAge
	case float64: // JSON parses numbers as float64
		age = int(v)
	default:
		http.Error(w, "Invalid Age type", http.StatusBadRequest)
		return
	}

	// Create the student object
	currentID++
	student := models.Student{
		ID:    currentID,
		Name:  name,
		Email: email,
		Age:   age,
	}

	// Store the student
	students[student.ID] = student

	// Send the created student as a response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(student)
	fmt.Println("Created student:", student)
}

// Get all students
func GetStudents(w http.ResponseWriter, r *http.Request) {
    fmt.Println("app is here")

    var allStudents []models.Student

    // Iterate over all students and append them to the allStudents slice
    for _, student := range students {
        allStudents = append(allStudents, student)
    }

    // Format the response JSON with indentation
    jsonResponse, err := json.MarshalIndent(allStudents, "", "    ")
    if err != nil {
        http.Error(w, "Failed to encode response", http.StatusInternalServerError)
        return
    }

    // Send the formatted JSON response
    w.Header().Set("Content-Type", "application/json")
    w.Write(jsonResponse)
}

// Get a student by ID
func GetStudent(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)

    // Convert the student ID from the URL parameter to an integer
    id, err := strconv.Atoi(params["id"])
    if err != nil {
        http.Error(w, "Invalid student ID", http.StatusBadRequest)
        return
    }

    // Find the student by ID
    student, exists := students[id]
    if !exists {
        http.Error(w, "Student not found", http.StatusNotFound)
        return
    }

    // Format the response JSON with indentation
    jsonResponse, err := json.MarshalIndent(student, "", "    ")
    if err != nil {
        http.Error(w, "Failed to encode response", http.StatusInternalServerError)
        return
    }

    // Send the formatted JSON response
    w.Header().Set("Content-Type", "application/json")
    w.Write(jsonResponse)
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
	var updatedStudentData map[string]interface{}
	err = json.NewDecoder(r.Body).Decode(&updatedStudentData)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		fmt.Println("Decoding error:", err)
		return
	}

	// Validate and parse the fields
	name, nameExists := updatedStudentData["Name"].(string)
	email, emailExists := updatedStudentData["Email"].(string)

	// Age validation: check if it's a string or number and convert accordingly
	var age int
	if ageVal, ok := updatedStudentData["Age"].(float64); ok {
		age = int(ageVal)
	} else if ageStr, ok := updatedStudentData["Age"].(string); ok {
		age, err = strconv.Atoi(ageStr)
		if err != nil {
			http.Error(w, "Age must be a valid number", http.StatusBadRequest)
			fmt.Println("Age conversion error:", ageStr)
			return
		}
	} else {
		http.Error(w, "Invalid Age input", http.StatusBadRequest)
		fmt.Println("Invalid Age:", updatedStudentData["Age"])
		return
	}

	// Ensure all required fields are present
	if !nameExists || !emailExists || age <= 0 {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		fmt.Println("Validation error:", updatedStudentData)
		return
	}

	// Check if the student exists
	student, exists := students[id]
	if !exists {
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}

	// Update the student data
	student.Name = name
	student.Age = age
	student.Email = email
	students[id] = student

	// Format the updated student JSON response with indentation
	jsonResponse, err := json.MarshalIndent(student, "", "    ")
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}

	// Set the content type and send the formatted JSON response
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
	fmt.Println("Updated student:", student)
}



// Delete a student by ID
// Delete a student by ID
func DeleteStudent(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid student ID", http.StatusBadRequest)
		fmt.Println("Invalid ID:", params["id"])
		return
	}

	// Check if the student exists
	student, exists := students[id]
	if !exists {
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}

	// Delete the student from the map
	delete(students, id)

	// Set header to application/json and encode deleted student details
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Format the JSON response with indentation
	formattedResponse, err := json.MarshalIndent(student, "", "    ")
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}

	// Write the formatted response
	w.Write(formattedResponse)
	fmt.Println("Deleted student:", student)
}




// Function to call Ollama API and get summary of a student profile
func GenerateSummary(w http.ResponseWriter, r *http.Request) {
	// Extract student ID from the URL
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid student ID", http.StatusBadRequest)
		fmt.Println("Invalid ID:", params["id"])
		return
	}

	// Fetch the student details from the students map
	student, exists := students[id]
	if !exists {
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}

	// Construct the prompt for Ollama to generate a summary
	prompt := fmt.Sprintf("Generate a brief professional summary for this student:\nName: %s\nAge: %d\nEmail: %s", student.Name, student.Age, student.Email)

	// Call Ollama API to generate the summary
	summary, err := callOllamaAPI(prompt)
	if err != nil {
		http.Error(w, "Failed to generate summary", http.StatusInternalServerError)
		fmt.Println("Ollama API error:", err)
		return
	}

	// Prepare the JSON response
	response := map[string]string{"summary": summary}

	// Format the response with indentation
	formattedResponse, err := json.MarshalIndent(response, "", "    ")
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}

	// Set the content type and send the formatted JSON response
	w.Header().Set("Content-Type", "application/json")
	w.Write(formattedResponse)
	fmt.Println("Generated summary:", summary)
}

// Function to interact with Ollama API
func callOllamaAPI(prompt string) (string, error) {
	ollamaAPIURL := "http://localhost:11434/api/generate"

	requestPayload := map[string]interface{}{
		"model": "llama3.2",
		"prompt": prompt,
		"stream": false,
	}

	jsonPayload, err := json.Marshal(requestPayload)
	if err != nil {
		return "", fmt.Errorf("error marshaling JSON: %v", err)
	}

	req, err := http.NewRequest("POST", ollamaAPIURL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return "", fmt.Errorf("error creating request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("error making request to Ollama API: %v", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response body: %v", err)
	}

	var response map[string]interface{}
	if err := json.Unmarshal(body, &response); err != nil {
		return "", fmt.Errorf("error unmarshaling response: %v", err)
	}

	// Assuming Ollama API returns a field named "response" that contains the summary
	summary, exists := response["response"].(string)
	if !exists {
		return "", fmt.Errorf("summary not found in response")
	}

	return summary, nil
}

