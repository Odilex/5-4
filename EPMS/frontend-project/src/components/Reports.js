import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Users, Building2, DollarSign } from 'lucide-react';

function Reports() {
  const [dailyReport, setDailyReport] = useState(null);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [employeeReport, setEmployeeReport] = useState([]);
  const [departmentReport, setDepartmentReport] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [daily, weekly, monthly, employees, departments] = await Promise.all([
        axios.get('http://localhost:5003/api/reports/daily'),
        axios.get('http://localhost:5003/api/reports/weekly'),
        axios.get('http://localhost:5003/api/reports/monthly'),
        axios.get('http://localhost:5003/api/reports/employees'),
        axios.get('http://localhost:5003/api/reports/departments')
      ]);
      setDailyReport(daily.data[0]);
      setWeeklyReport(weekly.data[0]);
      setMonthlyReport(monthly.data[0]);
      setEmployeeReport(employees.data);
      setDepartmentReport(departments.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <BarChart3 className="w-8 h-8 mr-2" />
        Reports Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Daily Report
          </h3>
          {dailyReport ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Date: {dailyReport.date}</p>
              <p className="text-sm text-gray-600">Total Payments: {dailyReport.totalPayments}</p>
              <p className="text-sm text-green-600">Total Net: ${dailyReport.totalNetSalary || 0}</p>
              <p className="text-sm text-gray-600">Total Gross: ${dailyReport.totalGrossSalary || 0}</p>
              <p className="text-sm text-red-600">Deductions: ${dailyReport.totalDeductions || 0}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Weekly Report
          </h3>
          {weeklyReport ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Week: {weeklyReport.week}</p>
              <p className="text-sm text-gray-600">Total Payments: {weeklyReport.totalPayments}</p>
              <p className="text-sm text-green-600">Total Net: ${weeklyReport.totalNetSalary || 0}</p>
              <p className="text-sm text-gray-600">Total Gross: ${weeklyReport.totalGrossSalary || 0}</p>
              <p className="text-sm text-red-600">Deductions: ${weeklyReport.totalDeductions || 0}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Monthly Report
          </h3>
          {monthlyReport ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Month: {monthlyReport.month}</p>
              <p className="text-sm text-gray-600">Total Payments: {monthlyReport.totalPayments}</p>
              <p className="text-sm text-green-600">Total Net: ${monthlyReport.totalNetSalary || 0}</p>
              <p className="text-sm text-gray-600">Total Gross: ${monthlyReport.totalGrossSalary || 0}</p>
              <p className="text-sm text-red-600">Deductions: ${monthlyReport.totalDeductions || 0}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Employee Report
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payments</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeReport.map((employee, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.employeeNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.firstName} {employee.lastName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.departmentName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.totalPayments || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">${employee.totalPaid || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Building2 className="w-6 h-6 mr-2" />
          Department Report
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Salary Paid</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentReport.map((department, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{department.departmentCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{department.departmentName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{department.totalEmployees || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">${department.totalSalaryPaid || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
