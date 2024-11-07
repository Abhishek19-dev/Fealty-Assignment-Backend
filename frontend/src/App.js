import React, { useState } from 'react';
import { createStudent, deleteStudent, getAllStudents, getStudentById, getStudentSummary, updateStudent } from './Api/Api';

function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ Name: '', Age: '', Email: '' });
  const [studentId, setStudentId] = useState('');
  const [studentById, setStudentById] = useState(null);
  const [updateStudentData, setUpdateStudentData] = useState({ Name: '', Age: '', Email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [studentSummary, setStudentSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');

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

  const handleGetSummary = async () => {
    if (!studentId) {
      setSummaryError('Please provide a valid student ID');
      return;
    }
    
    setLoadingSummary(true);
    setSummaryError('');
    setStudentSummary('');
    
    try {
      const summary = await getStudentSummary(studentId);
      setStudentSummary(summary);
    } catch (err) {
      setSummaryError('Error generating summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-nunito">
      <h1 className="text-4xl font-bold text-center mb-8">Student Management</h1>

      {/* Message Display */}
      {message && <div className="bg-green-200 p-4 rounded-md mb-6">{message}</div>}
      {error && <div className="bg-red-200 p-4 rounded-md mb-6">{error}</div>}

      {/* Button Section */}
      <div className="flex justify-center gap-6 mb-8">
        <button 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleGetStudents}
        >
          Get All Students
        </button>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          onClick={handleCreateStudent}
        >
          Create New Student
        </button>
        <button
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={handleGetStudentById}
        >
          Get Student by ID
        </button>
        <button
          className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onClick={handleGetSummary}
        >
          Generate Student Summary
        </button>
      </div>

      {/* Display All Students */}
      <div className="my-8">
        <h2 className="text-2xl font-semibold">Student List</h2>
        <div className="mt-4 space-y-4">
          {students.length > 0 ? (
            students.map(student => (
              <div key={student.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-gray-600">Age: {student.age}</p>
                  <p className="text-gray-600">Email: {student.email}</p>
                </div>
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No students found.</p>
          )}
        </div>
      </div>

      {/* Form to Get a Student by ID */}
      <div className="my-8">
        <h2 className="text-xl font-semibold">Get Student by ID</h2>
        <input
          type="number"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full"
          required
        />
        <button 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full mt-4"
          onClick={handleGetStudentById}
        >
          Get Student
        </button>
        {studentById && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="font-semibold">{studentById.name}</p>
            <p className="text-gray-600">Age: {studentById.age}</p>
            <p className="text-gray-600">Email: {studentById.email}</p>
          </div>
        )}
      </div>

      {/* Form to Generate Student Summary */}
      <div className="my-8">
        <h2 className="text-xl font-semibold">Generate Student Summary</h2>
        <input
          type="number"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full"
          required
        />
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full mt-4"
          onClick={handleGetSummary}
          disabled={loadingSummary}
        >
          {loadingSummary ? 'Generating...' : 'Generate Summary'}
        </button>
        {summaryError && <div className="bg-red-200 p-4 rounded-md mt-4">{summaryError}</div>}
        {studentSummary && !loadingSummary && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">Summary:</h3>
            <p>{studentSummary}</p>
          </div>
        )}
      </div>

      {/* Form to Update a Student */}
      <div className="my-8">
        <h2 className="text-xl font-semibold">Update Student</h2>
        <form className="space-y-4" onSubmit={handleUpdateStudent}>
          <input
            type="number"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full"
            required
          />
          <input
            type="text"
            placeholder="New Name"
            value={updateStudentData.Name}
            onChange={(e) => setUpdateStudentData({ ...updateStudentData, Name: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg w-full"
            required
          />
          <input
            type="number"
            placeholder="New Age"
            value={updateStudentData.Age}
            onChange={(e) => setUpdateStudentData({ ...updateStudentData, Age: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg w-full"
            required
          />
          <input
            type="email"
            placeholder="New Email"
            value={updateStudentData.Email}
            onChange={(e) => setUpdateStudentData({ ...updateStudentData, Email: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg w-full"
            required
          />
          <button type="submit" className="bg-yellow-500 text-white py-3 px-6 rounded-lg w-full">
            Update Student
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
