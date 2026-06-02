import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Warehouse } from 'lucide-react';

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    warehouseCode: '',
    warehouseName: '',
    warehouseLocation: ''
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/warehouses');
      setWarehouses(response.data);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/warehouses', formData);
      setFormData({
        warehouseCode: '',
        warehouseName: '',
        warehouseLocation: ''
      });
      fetchWarehouses();
    } catch (err) {
      console.error('Error creating warehouse:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Warehouse className="w-6 h-6 mr-2" />
          Add Warehouse
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Warehouse Code</label>
            <input
              type="text"
              value={formData.warehouseCode}
              onChange={(e) => setFormData({ ...formData, warehouseCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Warehouse Name</label>
            <input
              type="text"
              value={formData.warehouseName}
              onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Warehouse Location</label>
            <input
              type="text"
              value={formData.warehouseLocation}
              onChange={(e) => setFormData({ ...formData, warehouseLocation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Warehouse
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Warehouses List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{warehouse.warehouseCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{warehouse.warehouseName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{warehouse.warehouseLocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Warehouses;
