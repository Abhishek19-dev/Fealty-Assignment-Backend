const API_URL = 'http://localhost:8080';

// Get all students
export async function getAllStudents() {
  const response = await fetch(`${API_URL}/students`);
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  return response.json();
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
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create student');
  }
  return response.json();
}

// Update an existing student by ID
export async function updateStudent(id, data) {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
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
