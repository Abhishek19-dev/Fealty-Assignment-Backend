// src/App.js
import React, { useState } from 'react';
import { createStudent, deleteStudent, getAllStudents, getStudentById, updateStudent } from './Api/Api';

function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ Name: '', Age: '', Email: '' });
  const [studentId, setStudentId] = useState('');
  const [studentById, setStudentById] = useState(null);
  const [updateStudentData, setUpdateStudentData] = useState({ Name: '', Age: '', Email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handlers for each API action
  const handleGetStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
      setMessage('Students retrieved successfully!');
      setError('');
    } catch (err) {
      setError('Error retrieving students.');
      setMessage('');
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      console.log("new student",newStudent)
      await createStudent(newStudent);
      setMessage('Student created successfully!');
      setError('');
      setNewStudent({ Name: '', Age: '', Email: '' });
      handleGetStudents();  // Refresh the list
    } catch (err) {
      setError('Error creating student.');
      setMessage('');
    }
  };

  const handleGetStudentById = async () => {
    try {
      const student = await getStudentById(studentId);
      setStudentById(student);
      setMessage(`Student with ID ${studentId} retrieved successfully!`);
      setError('');
    } catch (err) {
      setError(`Error retrieving student with ID ${studentId}.`);
      setMessage('');
      setStudentById(null);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(studentId, updateStudentData);
      setMessage(`Student with ID ${studentId} updated successfully!`);
      setError('');
      setUpdateStudentData({ Name: '', Age: '', Email: '' });
      handleGetStudents();  // Refresh the list
    } catch (err) {
      setError(`Error updating student with ID ${studentId}.`);
      setMessage('');
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      setMessage(`Student with ID ${id} deleted successfully!`);
      setError('');
      handleGetStudents();  // Refresh the list
    } catch (err) {
      setError(`Error deleting student with ID ${id}.`);
      setMessage('');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Student Management</h1>

      {/* Message Display */}
      {message && <div className="bg-green-200 p-2 my-4">{message}</div>}
      {error && <div className="bg-red-200 p-2 my-4">{error}</div>}

      {/* Buttons for Actions */}
      <div className="space-x-4 mb-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleGetStudents}>
          Get All Students
        </button>
      </div>

   {/* Display All Students */}
{Array.isArray(students) && students.length > 0 && (
  <div className="my-4">
    <h2 className="text-2xl mb-2">Student List</h2>
    {students.map(student => (
      <div key={student.id} className="bg-gray-100 p-2 rounded mb-2 flex justify-between">
        <div>
          <p>Name: {student.name}</p>
          <p>Age: {student.age}</p>
          <p>Email: {student.email}</p>
        </div>
        <button
          className="bg-red-500 text-white px-4 py-1 rounded"
          onClick={() => handleDeleteStudent(student.id)}
        >
          Delete
        </button>
      </div>
    ))}
  </div>
)}

      {/* Form to Create a New Student */}
      <form className="space-y-4" onSubmit={handleCreateStudent}>
        <h2 className="text-2xl">Add New Student</h2>
        <input
          type="text"
          placeholder="Name"
          value={newStudent.Name}
          onChange={(e) => setNewStudent({ ...newStudent, Name: e.target.value })}
          className="border border-gray-300 p-2 rounded w-full"
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={newStudent.Age}
          onChange={(e) => setNewStudent({ ...newStudent, Age: e.target.value })}
          className="border border-gray-300 p-2 rounded w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newStudent.Email}
          onChange={(e) => setNewStudent({ ...newStudent, Email: e.target.value })}
          className="border border-gray-300 p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Student
        </button>
      </form>

      {/* Form to Get a Student by ID */}
      <div className="my-4">
        <h2 className="text-2xl">Get Student by ID</h2>
        <input
          type="number"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          required
        />
        <button onClick={handleGetStudentById} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          Get Student
        </button>
        {studentById && (
          <div className="bg-gray-100 p-2 rounded mt-4">
            <p>Name: {studentById.name}</p>
            <p>Age: {studentById.age}</p>
            <p>Email: {studentById.email}</p>
          </div>
        )}
      </div>

      {/* Form to Update a Student by ID */}
      <form className="space-y-4" onSubmit={handleUpdateStudent}>
        <h2 className="text-2xl">Update Student</h2>
        <input
          type="number"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="New Name"
          value={updateStudentData.Name}
          onChange={(e) => setUpdateStudentData({ ...updateStudentData, Name: e.target.value })}
          className="border border-gray-300 p-2 rounded w-full"
          required
        />
        <input
          type="number"
          placeholder="New Age"
          value={updateStudentData.Age}
          onChange={(e) => setUpdateStudentData({ ...updateStudentData, Age: e.target.value })}
          className="border border-gray-300 p-2 rounded w-full"
          required
        />
        <input
          type="email"
          placeholder="New Email"
          value={updateStudentData.Email}
          onChange={(e) => setUpdateStudentData({ ...updateStudentData, Email: e.target.value })}
          className="border border-gray-300 p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
          Update Student
        </button>
      </form>
    </div>
  );
}

export default App;
