import connection from "../connection";

const supplierServices = {
  
  createSupplier: async (data) => {
    try {
      const response = await connection.post(`/supplier/create`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllSuppliers: async () => {
    try {
      const response = await connection.get(`/supplier`);
      return response.data.suppliers;
    } catch (error) {
      throw new Error('Error fetching suppliers');
    }
  },

  getSupplierById: async (supplierId) => {
    try {
      const response = await connection.get(`/supplier/show/${supplierId}`);
      return response.data;

    } catch (error) {
      throw new Error('Error fetching supplier by ID');
    }
  },

  updateSupplier: async (supplierId, data) => {
    try {
      const response = await connection.put(`/supplier/${supplierId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  activateSupplier: async (supplierId) => {
    try {
      const response = await connection.put(`/supplier/activate/${supplierId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deactivateSupplier: async (supplierId) => {
    try {
      const response = await connection.put(`/supplier/deactivate/${supplierId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteSupplier: async (supplierId) => {
    try {
      const response = await connection.delete(`/supplier/${supplierId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting supplier: ${error.message}`);
    }
  },

};

export default supplierServices;
