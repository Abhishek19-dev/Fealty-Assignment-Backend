const API_URL = 'http://localhost:8080';

// Get all students
export async function getAllStudents() {
  try {
    const response = await fetch(`${API_URL}/students`);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    return []; // Return an empty array in case of an error
  }
}

// Get a single student by ID
export async function getStudentById(id) {
  const response = await fetch(`${API_URL}/students/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch student with ID: ${id}`);
  }
  return response.json();
}

// Create a new student
export async function createStudent(data) {
  console.log("data is : " , data);
  
  // Ensure Age is a number, not a string
  const formattedData = {
    ...data,
    Age: parseInt(data.Age, 10),  // Convert Age to an integer if it's a string
  };
  
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formattedData),  // Send the formatted data
  });
  
  if (!response.ok) {
    throw new Error('Failed to create student');
  }
  return response.json();
}

// Update an existing student by ID
export async function updateStudent(id, data) {
  const formattedData = {
    ...data,
    Age: parseInt(data.Age, 10),  // Convert Age to an integer if it's a string
  };

  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formattedData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update student with ID: ${id}`);
  }

  return response.json();
}


// Delete a student by ID
export async function deleteStudent(id) {
  const response = await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Failed to delete student with ID: ${id}`);
  }
}

//genrate summary
export async function getStudentSummary(id) {
  console.log("I am teher")
  const response = await fetch(`${API_URL}/students/${id}/summary`);
  if (!response.ok) {
    throw new Error('Failed to fetch student summary');
  }
  const data = await response.json();
  return data.summary;  // This is the AI-generated summary
}
