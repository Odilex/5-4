import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Users, Building2, AlertCircle } from 'lucide-react';

function Reports() {
  const [employeeStatusReport, setEmployeeStatusReport] = useState([]);
  const [summaryReport, setSummaryReport] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [status, summary] = await Promise.all([
        axios.get('http://localhost:5004/api/reports/employee-status', { withCredentials: true }),
        axios.get('http://localhost:5004/api/reports/employee-status-summary', { withCredentials: true })
      ]);
      setEmployeeStatusReport(status.data);
      setSummaryReport(summary.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <BarChart3 className="w-8 h-8 mr-2" />
        Employee Status Report
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Building2 className="w-6 h-6 mr-2" />
          Department Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On Leave</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Left</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blacklisted</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deceased</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summaryReport.map((summary, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{summary.DepartmentName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{summary.TotalEmployees || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">{summary.Active || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-600">{summary.OnLeave || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{summary.Left || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">{summary.Blacklisted || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-600">{summary.Deceased || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Employee Status Details
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeStatusReport.map((employee, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.DepartmentName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.EmpFirstName} {employee.EmpLastName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.PositionName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.EmpStatus)}`}>
                      {employee.EmpStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 mr-2 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Total Active</p>
              <p className="text-2xl font-bold text-green-600">
                {summaryReport.reduce((sum, dept) => sum + (dept.Active || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 mr-2 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600">
                {summaryReport.reduce((sum, dept) => sum + (dept.OnLeave || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 mr-2 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Left</p>
              <p className="text-2xl font-bold text-gray-600">
                {summaryReport.reduce((sum, dept) => sum + (dept.Left || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 mr-2 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Blacklisted</p>
              <p className="text-2xl font-bold text-red-600">
                {summaryReport.reduce((sum, dept) => sum + (dept.Blacklisted || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 mr-2 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Deceased</p>
              <p className="text-2xl font-bold text-purple-600">
                {summaryReport.reduce((sum, dept) => sum + (dept.Deceased || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
