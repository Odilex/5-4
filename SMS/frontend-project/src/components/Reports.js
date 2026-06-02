import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Package, ArrowDown } from 'lucide-react';

function Reports() {
  const [dailyReport, setDailyReport] = useState(null);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [stockReport, setStockReport] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [daily, weekly, monthly, stock] = await Promise.all([
        axios.get('http://localhost:5000/api/reports/daily'),
        axios.get('http://localhost:5000/api/reports/weekly'),
        axios.get('http://localhost:5000/api/reports/monthly'),
        axios.get('http://localhost:5000/api/reports/stock')
      ]);
      setDailyReport(daily.data[0]);
      setWeeklyReport(weekly.data[0]);
      setMonthlyReport(monthly.data[0]);
      setStockReport(stock.data);
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
              <p className="text-sm text-gray-600">Total Transactions: {dailyReport.totalTransactions}</p>
              <p className="text-sm text-green-600">Stock In: {dailyReport.totalStockIn || 0}</p>
              <p className="text-sm text-red-600">Stock Out: {dailyReport.totalStockOut || 0}</p>
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
              <p className="text-sm text-gray-600">Total Transactions: {weeklyReport.totalTransactions}</p>
              <p className="text-sm text-green-600">Stock In: {weeklyReport.totalStockIn || 0}</p>
              <p className="text-sm text-red-600">Stock Out: {weeklyReport.totalStockOut || 0}</p>
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
              <p className="text-sm text-gray-600">Total Transactions: {monthlyReport.totalTransactions}</p>
              <p className="text-sm text-green-600">Stock In: {monthlyReport.totalStockIn || 0}</p>
              <p className="text-sm text-red-600">Stock Out: {monthlyReport.totalStockOut || 0}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Package className="w-6 h-6 mr-2" />
          Stock Availability Report
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total In</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Out</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockReport.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.productCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.quantityInStock}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${item.unitPrice}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">{item.totalIn || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">{item.totalOut || 0}</td>
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
