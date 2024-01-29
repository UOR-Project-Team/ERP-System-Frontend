import connection from "../connection";

const customerServices = {
  
  createCustomer: async (data) => {
    try {
      const response = await connection.post(`/customer/create`, data,  {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllCustomers: async () => {
    try {
      const response = await connection.get(`/customer`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching customers');
    }
  },

  getCustomerById: async (customerId) => {
    try {
      const response = await connection.get(`/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching customer by ID');
    }
  },

  updateCustomer: async (customerId, data) => {
    try {
      const response = await connection.put(`/customer/${customerId}`, data,  {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  activateCustomer: async (customerId) => {
    try {
      const response = await connection.put(`/customer/activate/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deactivateCustomer: async (customerId) => {
    try {
      const response = await connection.put(`/customer//deactivate/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCustomer: async (customerId) => {
    try {
      const response = await connection.delete(`/customer//${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting customer: ${error.message}`);
    }
  },

};

export default customerServices;
