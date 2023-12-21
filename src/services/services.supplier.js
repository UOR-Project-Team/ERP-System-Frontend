import axios from 'axios';
const apiUrl = 'http://localhost:8081/supplier';

const supplierServices = {
  
  createSupplier: async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/create`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error creating supplier');
    }
  },

  getAllSuppliers: async () => {
    try {
      const response = await axios.get(`${apiUrl}`);
      return response.data.suppliers;
    } catch (error) {
      throw new Error('Error fetching suppliers');
    }
  },

  getSupplierById: async (supplierId) => {
    try {
      const response = await axios.get(`${apiUrl}/show/${supplierId}`);
      return response.data;

    } catch (error) {
      throw new Error('Error fetching supplier by ID');
    }
  },

  updateSupplier: async (supplierId, data) => {
    try {
      const response = await axios.put(`${apiUrl}/${supplierId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error updating supplier: ${error.message}`);
    }
  },


  deleteSupplier: async (supplierId) => {
    try {
      const response = await axios.delete(`${apiUrl}/${supplierId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting supplier: ${error.message}`);
    }
  },

};

export default supplierServices;
