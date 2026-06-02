import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Box } from 'lucide-react';

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [formData, setFormData] = useState({
    deliveryCode: '',
    deliveryDate: '',
    quantityDelivered: '',
    deliveryStatus: 'Pending',
    shipmentNumber: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDeliveries();
    fetchShipments();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/deliveries');
      setDeliveries(response.data);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
    }
  };

  const fetchShipments = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/shipments');
      setShipments(response.data);
    } catch (err) {
      console.error('Error fetching shipments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5002/api/deliveries/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5002/api/deliveries', formData);
      }
      setFormData({
        deliveryCode: '',
        deliveryDate: '',
        quantityDelivered: '',
        deliveryStatus: 'Pending',
        shipmentNumber: ''
      });
      fetchDeliveries();
    } catch (err) {
      console.error('Error saving delivery:', err);
    }
  };

  const handleEdit = (delivery) => {
    setFormData({
      deliveryCode: delivery.deliveryCode,
      deliveryDate: delivery.deliveryDate,
      quantityDelivered: delivery.quantityDelivered,
      deliveryStatus: delivery.deliveryStatus,
      shipmentNumber: delivery.shipmentNumber
    });
    setEditingId(delivery.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/deliveries/${id}`);
      fetchDeliveries();
    } catch (err) {
      console.error('Error deleting delivery:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Box className="w-6 h-6 mr-2" />
          {editingId ? 'Edit Delivery' : 'Add Delivery'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Delivery Code</label>
            <input
              type="text"
              value={formData.deliveryCode}
              onChange={(e) => setFormData({ ...formData, deliveryCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Delivery Date</label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity Delivered</label>
            <input
              type="number"
              value={formData.quantityDelivered}
              onChange={(e) => setFormData({ ...formData, quantityDelivered: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Delivery Status</label>
            <select
              value={formData.deliveryStatus}
              onChange={(e) => setFormData({ ...formData, deliveryStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Shipment</label>
            <select
              value={formData.shipmentNumber}
              onChange={(e) => setFormData({ ...formData, shipmentNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Shipment</option>
              {shipments.map((shipment) => (
                <option key={shipment.shipmentNumber} value={shipment.shipmentNumber}>
                  {shipment.shipmentNumber} - {shipment.destination}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editingId ? 'Update' : 'Add'} Delivery
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    deliveryCode: '',
                    deliveryDate: '',
                    quantityDelivered: '',
                    deliveryStatus: 'Pending',
                    shipmentNumber: ''
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Deliveries List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{delivery.deliveryCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{delivery.deliveryDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{delivery.quantityDelivered}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      delivery.deliveryStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      delivery.deliveryStatus === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {delivery.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{delivery.shipmentNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleEdit(delivery)}
                      className="text-orange-600 hover:text-orange-800 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(delivery.id)}
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

export default Deliveries;
