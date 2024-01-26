import http from "../http-common";

const customerServices = {
  
  createCustomer: async (data) => {
    try {
      const response = await http.post(`/customer/create`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllCustomers: async () => {
    try {
      const response = await http.get(`/customer`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching customers');
    }
  },

  getCustomerById: async (customerId) => {
    try {
      const response = await http.get(`/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching customer by ID');
    }
  },

  updateCustomer: async (customerId, data) => {
    try {
      const response = await http.put(`/customer/${customerId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  activateCustomer: async (customerId) => {
    try {
      const response = await http.put(`/customer/activate/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deactivateCustomer: async (customerId) => {
    try {
      const response = await http.put(`/customer//deactivate/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCustomer: async (customerId) => {
    try {
      const response = await http.delete(`/customer//${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting customer: ${error.message}`);
    }
  },

};

export default customerServices;
