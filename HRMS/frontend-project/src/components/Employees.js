import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, Users } from 'lucide-react';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [formData, setFormData] = useState({
    empNumber: '',
    empFirstName: '',
    empLastName: '',
    empGender: 'Male',
    empDateOfBirth: '',
    empEmail: '',
    empTelephone: '',
    empAddress: '',
    empStatus: 'Active',
    departmentCode: '',
    positionCode: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchPositions();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5004/api/employees', { withCredentials: true });
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5004/api/departments', { withCredentials: true });
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get('http://localhost:5004/api/positions', { withCredentials: true });
      setPositions(response.data);
    } catch (err) {
      console.error('Error fetching positions:', err);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5004/api/employees?search=${searchTerm}`, { withCredentials: true });
      setEmployees(response.data);
    } catch (err) {
      console.error('Error searching employees:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5004/api/employees/${editingId}`, formData, { withCredentials: true });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5004/api/employees', formData, { withCredentials: true });
      }
      setFormData({
        empNumber: '',
        empFirstName: '',
        empLastName: '',
        empGender: 'Male',
        empDateOfBirth: '',
        empEmail: '',
        empTelephone: '',
        empAddress: '',
        empStatus: 'Active',
        departmentCode: '',
        positionCode: ''
      });
      fetchEmployees();
    } catch (err) {
      console.error('Error saving employee:', err);
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      empNumber: employee.EmpNumber,
      empFirstName: employee.EmpFirstName,
      empLastName: employee.EmpLastName,
      empGender: employee.EmpGender,
      empDateOfBirth: employee.EmpDateOfBirth,
      empEmail: employee.EmpEmail,
      empTelephone: employee.EmpTelephone,
      empAddress: employee.EmpAddress,
      empStatus: employee.EmpStatus,
      departmentCode: employee.DepartmentCode,
      positionCode: employee.PositionCode
    });
    setEditingId(employee.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5004/api/employees/${id}`, { withCredentials: true });
      fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Left': return 'bg-gray-100 text-gray-800';
      case 'Blacklisted': return 'bg-red-100 text-red-800';
      case 'Deceased': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          {editingId ? 'Edit Employee' : 'Add Employee'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Employee Number</label>
            <input
              type="text"
              value={formData.empNumber}
              onChange={(e) => setFormData({ ...formData, empNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
            <input
              type="text"
              value={formData.empFirstName}
              onChange={(e) => setFormData({ ...formData, empFirstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
            <input
              type="text"
              value={formData.empLastName}
              onChange={(e) => setFormData({ ...formData, empLastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
            <select
              value={formData.empGender}
              onChange={(e) => setFormData({ ...formData, empGender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.empDateOfBirth}
              onChange={(e) => setFormData({ ...formData, empDateOfBirth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={formData.empEmail}
              onChange={(e) => setFormData({ ...formData, empEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Telephone</label>
            <input
              type="text"
              value={formData.empTelephone}
              onChange={(e) => setFormData({ ...formData, empTelephone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select
              value={formData.empStatus}
              onChange={(e) => setFormData({ ...formData, empStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Left">Left</option>
              <option value="Blacklisted">Blacklisted</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
            <select
              value={formData.departmentCode}
              onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.DepartmentCode}>
                  {dept.DepartmentName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Position</label>
            <select
              value={formData.positionCode}
              onChange={(e) => setFormData({ ...formData, positionCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Position</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.PositionCode}>
                  {pos.PositionName}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
            <input
              type="text"
              value={formData.empAddress}
              onChange={(e) => setFormData({ ...formData, empAddress: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-3 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editingId ? 'Update' : 'Add'} Employee
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    empNumber: '',
                    empFirstName: '',
                    empLastName: '',
                    empGender: 'Male',
                    empDateOfBirth: '',
                    empEmail: '',
                    empTelephone: '',
                    empAddress: '',
                    empStatus: 'Active',
                    departmentCode: '',
                    positionCode: ''
                  });
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Employees List</h2>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telephone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.EmpNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.EmpFirstName} {employee.EmpLastName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.EmpEmail}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.EmpTelephone}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.EmpStatus)}`}>
                      {employee.EmpStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.DepartmentCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.PositionCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Employees;
