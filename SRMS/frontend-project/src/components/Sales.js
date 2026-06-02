import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, ShoppingCart } from 'lucide-react';

function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    salesDate: '',
    paymentMethod: 'Cash',
    totalAmountPaid: '',
    customerNumber: '',
    productCode: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/sales');
      setSales(response.data);
    } catch (err) {
      console.error('Error fetching sales:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/customers');
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5001/api/sales/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5001/api/sales', formData);
      }
      setFormData({
        invoiceNumber: '',
        salesDate: '',
        paymentMethod: 'Cash',
        totalAmountPaid: '',
        customerNumber: '',
        productCode: ''
      });
      fetchSales();
    } catch (err) {
      console.error('Error saving sale:', err);
    }
  };

  const handleEdit = (sale) => {
    setFormData({
      invoiceNumber: sale.invoiceNumber,
      salesDate: sale.salesDate,
      paymentMethod: sale.paymentMethod,
      totalAmountPaid: sale.totalAmountPaid,
      customerNumber: sale.customerNumber,
      productCode: sale.productCode
    });
    setEditingId(sale.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/sales/${id}`);
      fetchSales();
    } catch (err) {
      console.error('Error deleting sale:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <ShoppingCart className="w-6 h-6 mr-2" />
          {editingId ? 'Edit Sale' : 'Add Sale'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Invoice Number</label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Sales Date</label>
            <input
              type="date"
              value={formData.salesDate}
              onChange={(e) => setFormData({ ...formData, salesDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Total Amount Paid</label>
            <input
              type="number"
              step="0.01"
              value={formData.totalAmountPaid}
              onChange={(e) => setFormData({ ...formData, totalAmountPaid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Customer</label>
            <select
              value={formData.customerNumber}
              onChange={(e) => setFormData({ ...formData, customerNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.customerNumber} value={customer.customerNumber}>
                  {customer.firstName} {customer.lastName} ({customer.customerNumber})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Product</label>
            <select
              value={formData.productCode}
              onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.productCode} value={product.productCode}>
                  {product.productName} ({product.productCode})
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editingId ? 'Update' : 'Add'} Sale
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    invoiceNumber: '',
                    salesDate: '',
                    paymentMethod: 'Cash',
                    totalAmountPaid: '',
                    customerNumber: '',
                    productCode: ''
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.invoiceNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.salesDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.paymentMethod}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${sale.totalAmountPaid}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.customerNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.productCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleEdit(sale)}
                      className="text-green-600 hover:text-green-800 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
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

export default Sales;
