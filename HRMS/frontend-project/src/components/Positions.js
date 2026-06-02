import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';

function Positions() {
  const [positions, setPositions] = useState([]);
  const [formData, setFormData] = useState({
    positionCode: '',
    positionName: '',
    requiredQualification: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get('http://localhost:5004/api/positions', { withCredentials: true });
      setPositions(response.data);
    } catch (err) {
      console.error('Error fetching positions:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5004/api/positions/${editingId}`, formData, { withCredentials: true });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5004/api/positions', formData, { withCredentials: true });
      }
      setFormData({
        positionCode: '',
        positionName: '',
        requiredQualification: ''
      });
      fetchPositions();
    } catch (err) {
      console.error('Error saving position:', err);
    }
  };

  const handleEdit = (position) => {
    setFormData({
      positionCode: position.PositionCode,
      positionName: position.PositionName,
      requiredQualification: position.RequiredQualification
    });
    setEditingId(position.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5004/api/positions/${id}`, { withCredentials: true });
      fetchPositions();
    } catch (err) {
      console.error('Error deleting position:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Briefcase className="w-6 h-6 mr-2" />
          {editingId ? 'Edit Position' : 'Add Position'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Position Code</label>
            <input
              type="text"
              value={formData.positionCode}
              onChange={(e) => setFormData({ ...formData, positionCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Position Name</label>
            <input
              type="text"
              value={formData.positionName}
              onChange={(e) => setFormData({ ...formData, positionName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Required Qualification</label>
            <input
              type="text"
              value={formData.requiredQualification}
              onChange={(e) => setFormData({ ...formData, requiredQualification: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editingId ? 'Update' : 'Add'} Position
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    positionCode: '',
                    positionName: '',
                    requiredQualification: ''
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Positions List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required Qualification</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {positions.map((position) => (
                <tr key={position.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{position.PositionCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{position.PositionName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{position.RequiredQualification}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleEdit(position)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(position.id)}
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

export default Positions;
