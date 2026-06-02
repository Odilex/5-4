import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';

function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    shipmentNumber: '',
    shipmentDate: '',
    shipmentStatus: 'Pending',
    destination: '',
    supplierCode: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchShipments();
    fetchSuppliers();
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/shipments');
      setShipments(response.data);
    } catch (err) {
      console.error('Error fetching shipments:', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5002/api/shipments/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5002/api/shipments', formData);
      }
      setFormData({
        shipmentNumber: '',
        shipmentDate: '',
        shipmentStatus: 'Pending',
        destination: '',
        supplierCode: ''
      });
      fetchShipments();
    } catch (err) {
      console.error('Error saving shipment:', err);
    }
  };

  const handleEdit = (shipment) => {
    setFormData({
      shipmentNumber: shipment.shipmentNumber,
      shipmentDate: shipment.shipmentDate,
      shipmentStatus: shipment.shipmentStatus,
      destination: shipment.destination,
      supplierCode: shipment.supplierCode
    });
    setEditingId(shipment.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/shipments/${id}`);
      fetchShipments();
    } catch (err) {
      console.error('Error deleting shipment:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Package className="w-6 h-6 mr-2" />
          {editingId ? 'Edit Shipment' : 'Add Shipment'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Shipment Number</label>
            <input
              type="text"
              value={formData.shipmentNumber}
              onChange={(e) => setFormData({ ...formData, shipmentNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Shipment Date</label>
            <input
              type="date"
              value={formData.shipmentDate}
              onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Shipment Status</label>
            <select
              value={formData.shipmentStatus}
              onChange={(e) => setFormData({ ...formData, shipmentStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Supplier</label>
            <select
              value={formData.supplierCode}
              onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.supplierCode} value={supplier.supplierCode}>
                  {supplier.supplierName} ({supplier.supplierCode})
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Destination</label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editingId ? 'Update' : 'Add'} Shipment
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    shipmentNumber: '',
                    shipmentDate: '',
                    shipmentStatus: 'Pending',
                    destination: '',
                    supplierCode: ''
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipments List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{shipment.shipmentNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{shipment.shipmentDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shipment.shipmentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      shipment.shipmentStatus === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {shipment.shipmentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{shipment.destination}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{shipment.supplierCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleEdit(shipment)}
                      className="text-orange-600 hover:text-orange-800 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(shipment.id)}
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

export default Shipments;
