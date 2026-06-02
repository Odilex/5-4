import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Truck, Package, Box } from 'lucide-react';

function Reports() {
  const [dailyReport, setDailyReport] = useState(null);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [supplierReport, setSupplierReport] = useState([]);
  const [shipmentReport, setShipmentReport] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [daily, weekly, monthly, suppliers, shipments] = await Promise.all([
        axios.get('http://localhost:5002/api/reports/daily'),
        axios.get('http://localhost:5002/api/reports/weekly'),
        axios.get('http://localhost:5002/api/reports/monthly'),
        axios.get('http://localhost:5002/api/reports/suppliers'),
        axios.get('http://localhost:5002/api/reports/shipments')
      ]);
      setDailyReport(daily.data[0]);
      setWeeklyReport(weekly.data[0]);
      setMonthlyReport(monthly.data[0]);
      setSupplierReport(suppliers.data);
      setShipmentReport(shipments.data);
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
              <p className="text-sm text-gray-600">Total Shipments: {dailyReport.totalShipments}</p>
              <p className="text-sm text-yellow-600">Pending: {dailyReport.pending || 0}</p>
              <p className="text-sm text-blue-600">In Transit: {dailyReport.inTransit || 0}</p>
              <p className="text-sm text-green-600">Delivered: {dailyReport.delivered || 0}</p>
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
              <p className="text-sm text-gray-600">Total Shipments: {weeklyReport.totalShipments}</p>
              <p className="text-sm text-yellow-600">Pending: {weeklyReport.pending || 0}</p>
              <p className="text-sm text-blue-600">In Transit: {weeklyReport.inTransit || 0}</p>
              <p className="text-sm text-green-600">Delivered: {weeklyReport.delivered || 0}</p>
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
              <p className="text-sm text-gray-600">Total Shipments: {monthlyReport.totalShipments}</p>
              <p className="text-sm text-yellow-600">Pending: {monthlyReport.pending || 0}</p>
              <p className="text-sm text-blue-600">In Transit: {monthlyReport.inTransit || 0}</p>
              <p className="text-sm text-green-600">Delivered: {monthlyReport.delivered || 0}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Truck className="w-6 h-6 mr-2" />
          Supplier Report
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telephone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Shipments</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {supplierReport.map((supplier, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{supplier.supplierCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{supplier.supplierName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{supplier.telephone}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{supplier.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{supplier.totalShipments || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">{supplier.deliveredShipments || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Package className="w-6 h-6 mr-2" />
          Shipment Report
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Quantity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipmentReport.map((shipment, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{shipment.shipmentNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{shipment.shipmentDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{shipment.shipmentStatus}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{shipment.destination}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{shipment.supplierName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{shipment.totalDeliveries || 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{shipment.totalQuantity || 0}</td>
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
