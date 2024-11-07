import React, { useEffect, useState } from 'react';
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
  const [view, setView] = useState(''); // Track which view is currently active

  const [createdStudent, setCreatedStudent] = useState(null);
  const [updatedStudent, setUpdatedStudent] = useState(null);
  const [getStudentById, setGetStudentById] = useState(null);


  // Handlers for each API action
  const handleGetStudents = async () => {
    try {
      setMessage('');
      const data = await getAllStudents();
      setStudents(data);
      setMessage('Students retrieved successfully!');
      setError('');
      setView('studentsList');
    } catch (err) {
      setError('Error retrieving students.');
      setMessage('');
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const createdStudent = await createStudent(newStudent);
      setCreatedStudent(createdStudent); 
      setStudents((prevStudents) => [...prevStudents, createdStudent]); // Add to list
      setMessage('Student created successfully!');
      setError('');
      setNewStudent({ Name: '', Age: '', Email: '' });
      setView('createStudent');
    } catch (err) {
      setError('Error creating student.');
      setMessage('');
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const updatedStudent = await updateStudent(studentId, updateStudentData);
      setUpdatedStudent(updatedStudent); // Store the updated student
      setMessage(`Student with ID ${studentId} updated successfully!`);
      setError('');
      setUpdateStudentData({ Name: '', Age: '', Email: '' });
      // handleGetStudents(); // Refresh the list of students
      setView('updateStudent');
    } catch (err) {
      setError(`Error updating student with ID ${studentId}.`);
      setMessage('');
    }
  };
  
  


  const handleGetStudentById = async () => {
    try {
      const student = await getStudentById(studentId);
      setGetStudentById(student)
      setMessage(`Student with ID ${studentId} retrieved successfully!`);
      setError('');
      setView('getStudentById');
    } catch (err) {
      setError(`Error retrieving student with ID ${studentId}.`);
      setMessage('');
      setStudentById(null);
    }
  };


  const handleDeleteStudent = async (id) => {
    try {
      const deletedStudent = await deleteStudent(id);
      setMessage(`Student with ID ${id} deleted successfully!`);
      setError('');
      handleGetStudents();
      setView('deletedStudent');
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
      setMessage('Summary generated successfully!');
      setLoadingSummary(false);
    } catch (err) {
      setSummaryError('Error generating summary');
      setLoadingSummary(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-nunito bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">Student Management</h1>

      {/* Message and Error Display */}
      {message && <div className="bg-green-200 p-4 rounded-md mb-6 text-green-800">{message}</div>}
      {error && <div className="bg-red-200 p-4 rounded-md mb-6 text-red-800">{error}</div>}

      {/* Button Section */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          onClick={() => setView('getStudents')}
        >
          Get All Students
        </button>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
          onClick={() => setView('createStudent')}
        >
          Create New Student
        </button>
        <button
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none"
          onClick={() => setView('updateStudent')}
        >
          Update Student
        </button>
        <button
          className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 focus:outline-none"
          onClick={() => setView('getStudentById')}
        >
          Get Student by ID
        </button>
        <button
          className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none"
          onClick={() => setView('generateSummary')}
        >
          Generate Summary
        </button>
        <button
          className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 focus:outline-none"
          onClick={() => setView('deleteStudent')}
        >
          Delete Student
        </button>
      </div>

      {/* Conditional Rendering of Views */}

      {/* Get All Students View */}
      {view === 'getStudents' && (
        <div className="my-8">
          <h2 className="text-2xl font-semibold">Student List</h2>
          <div className="mt-4 space-y-4">
            {students.length > 0 ? (
              students.map(student => (
                <div key={student.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                  <div>
                    <p className="font-semibold text-indigo-600">{student.name} (ID: {student.id})</p>
                    <p className="text-gray-600">Age: {student.age}</p>
                    <p className="text-gray-600">Email: {student.email}</p>
                  </div>
                  <div className="space-x-4">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      onClick={() => {
                        setStudentId(student.id);
                        setView('updateStudent');
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No students found.</p>
            )}
          </div>
        </div>
      )}

      {/* Create Student Form View */}
{view === 'createStudent' && (
  <div className="my-8 p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Create New Student</h2>

    {/* Display newly created student data */}
    {createdStudent && (
  <div className="bg-green-100 p-4 rounded-md mb-6">
    <p className="font-semibold text-green-800">Student Added Successfully:</p>
    <p>Name: {createdStudent.name}</p>
    <p>Age: {createdStudent.age}</p>
    <p>Email: {createdStudent.email}</p>
  </div>
)}


    <form className="space-y-4" onSubmit={handleCreateStudent}>
      <input
        type="text"
        placeholder="Name"
        value={newStudent.Name}
        onChange={(e) => setNewStudent({ ...newStudent, Name: e.target.value })}
        className="border border-gray-300 p-3 rounded-lg w-full"
        required
      />
      <input
        type="number"
        placeholder="Age"
        value={newStudent.Age}
        onChange={(e) => setNewStudent({ ...newStudent, Age: e.target.value })}
        className="border border-gray-300 p-3 rounded-lg w-full"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={newStudent.Email}
        onChange={(e) => setNewStudent({ ...newStudent, Email: e.target.value })}
        className="border border-gray-300 p-3 rounded-lg w-full"
        required
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600"
      >
        Create Student
      </button>
    </form>
  </div>
)}


      {/* Update Student Form View */}
      {view === 'updateStudent' && (
        <div className="my-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Update Student</h2>

          {updatedStudent && (
  <div className="bg-green-100 p-4 rounded-md mb-6">
    <p className="font-semibold text-green-800">Student Updated Successfully:</p>
    <p>Name: {updatedStudent.name}</p>
    <p>Age: {updatedStudent.age}</p>
    <p>Email: {updatedStudent.email}</p>
  </div>
)}
          <form className="space-y-4" onSubmit={handleUpdateStudent}>
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full"
          />
            <input
              type="text"
              placeholder="Name"
              value={updateStudentData.Name}
              onChange={(e) => setUpdateStudentData({ ...updateStudentData, Name: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full"
            />
            <input
              type="number"
              placeholder="Age"
              value={updateStudentData.Age}
              onChange={(e) => setUpdateStudentData({ ...updateStudentData, Age: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={updateStudentData.Email}
              onChange={(e) => setUpdateStudentData({ ...updateStudentData, Email: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600"
            >
              Update Student
            </button>
          </form>
        </div>
      )}

      {/* Get Student by ID View */}
      {view === 'getStudentById' && (
        <div className="my-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Get Student by ID</h2>
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full"
          />
          <button
            onClick={handleGetStudentById}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 mt-4"
          >
            Get Student
          </button>
          {studentById && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-lg font-semibold">Student Details:</p>
              <p>Name: {studentById.name}</p>
              <p>Age: {studentById.age}</p>
              <p>Email: {studentById.email}</p>
            </div>
          )}
        </div>
      )}

      {/* Generate Summary View */}
      {view === 'generateSummary' && (
        <div className="my-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generate Summary for Student</h2>
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full"
          />
          <button
            onClick={handleGetSummary}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 mt-4"
          >
            {loadingSummary ? 'Generating...' : 'Generate Summary'}
          </button>
          {summaryError && <p className="text-red-500 mt-4">{summaryError}</p>}
          {studentSummary && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-lg font-semibold">Summary:</p>
              <p>{studentSummary}</p>
            </div>
          )}
        </div>
      )}


       {/* Delete Student View */}
       {view === 'deleteStudent' && (
        <div className="my-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Delete Student</h2>
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full"
          />
          <button
            onClick={handleDeleteStudent(studentId)}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 mt-4"
          >
            Delete Student
          </button>
          {studentById && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-lg font-semibold">Student Details:</p>
              <p>Name: {studentById.name}</p>
              <p>Age: {studentById.age}</p>
              <p>Email: {studentById.email}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
