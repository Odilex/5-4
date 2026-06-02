import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react';

function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    grossSalary: '',
    totalDeduction: '',
    netSalary: '',
    monthOfPayment: '',
    employeeNumber: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get('http://localhost:5003/api/salaries');
      setSalaries(response.data);
    } catch (err) {
      console.error('Error fetching salaries:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5003/api/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5003/api/salaries/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5003/api/salaries', formData);
      }
      setFormData({
        grossSalary: '',
        totalDeduction: '',
        netSalary: '',
        monthOfPayment: '',
        employeeNumber: ''
      });
      fetchSalaries();
    } catch (err) {
      console.error('Error saving salary:', err);
    }
  };

  const handleEdit = (salary) => {
    setFormData({
      grossSalary: salary.grossSalary,
      totalDeduction: salary.totalDeduction,
      netSalary: salary.netSalary,
      monthOfPayment: salary.monthOfPayment,
      employeeNumber: salary.employeeNumber
    });
    setEditingId(salary.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5003/api/salaries/${id}`);
      fetchSalaries();
    } catch (err) {
      console.error('Error deleting salary:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <DollarSign className="w-6 h-6 mr-2" />
          {editingId ? 'Edit Salary' : 'Add Salary'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Gross Salary</label>
            <input
              type="number"
              step="0.01"
              value={formData.grossSalary}
              onChange={(e) => setFormData({ ...formData, grossSalary: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Total Deduction</label>
            <input
              type="number"
              step="0.01"
              value={formData.totalDeduction}
              onChange={(e) => setFormData({ ...formData, totalDeduction: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Net Salary</label>
            <input
              type="number"
              step="0.01"
              value={formData.netSalary}
              onChange={(e) => setFormData({ ...formData, netSalary: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Month of Payment</label>
            <input
              type="date"
              value={formData.monthOfPayment}
              onChange={(e) => setFormData({ ...formData, monthOfPayment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Employee</label>
            <select
              value={formData.employeeNumber}
              onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.employeeNumber} value={employee.employeeNumber}>
                  {employee.firstName} {employee.lastName} ({employee.employeeNumber})
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editingId ? 'Update' : 'Add'} Salary
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    grossSalary: '',
                    totalDeduction: '',
                    netSalary: '',
                    monthOfPayment: '',
                    employeeNumber: ''
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Salaries List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaries.map((salary) => (
                <tr key={salary.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${salary.grossSalary}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">${salary.totalDeduction}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">${salary.netSalary}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{salary.monthOfPayment}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{salary.employeeNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleEdit(salary)}
                      className="text-purple-600 hover:text-purple-800 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(salary.id)}
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

export default Salaries;
