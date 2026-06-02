import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Users, Package, DollarSign } from 'lucide-react';

function Reports() {
  const [dailyReport, setDailyReport] = useState(null);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [customerReport, setCustomerReport] = useState([]);
  const [productReport, setProductReport] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [daily, weekly, monthly, customers, products] = await Promise.all([
        axios.get('http://localhost:5001/api/reports/daily'),
        axios.get('http://localhost:5001/api/reports/weekly'),
        axios.get('http://localhost:5001/api/reports/monthly'),
        axios.get('http://localhost:5001/api/reports/customers'),
        axios.get('http://localhost:5001/api/reports/products')
      ]);
      setDailyReport(daily.data[0]);
      setWeeklyReport(weekly.data[0]);
      setMonthlyReport(monthly.data[0]);
      setCustomerReport(customers.data);
      setProductReport(products.data);
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
              <p className="text-sm text-gray-600">Total Sales: {dailyReport.totalSales}</p>
              <p className="text-sm text-green-600">Revenue: ${dailyReport.totalRevenue || 0}</p>
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
              <p className="text-sm text-gray-600">Total Sales: {weeklyReport.totalSales}</p>
              <p className="text-sm text-green-600">Revenue: ${weeklyReport.totalRevenue || 0}</p>
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
              <p className="text-sm text-gray-600">Total Sales: {monthlyReport.totalSales}</p>
              <p className="text-sm text-green-600">Revenue: ${monthlyReport.totalRevenue || 0}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Customer Report
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telephone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchases</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customerReport.map((customer, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.customerNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.firstName} {customer.lastName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.telephone}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.totalPurchases || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">${customer.totalSpent || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Package className="w-6 h-6 mr-2" />
          Product Report
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Times Sold</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productReport.map((product, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{product.productCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{product.productName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{product.quantitySold}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${product.unitPrice}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{product.timesSold || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">${product.totalRevenue || 0}</td>
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
