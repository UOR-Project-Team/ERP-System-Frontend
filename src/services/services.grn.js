import axios from 'axios';
const apiUrl = 'http://localhost:8081/grn';

const grnServices = {

  getAllSuppliers: async () => {
    try {
      const response = await axios.get(`${apiUrl}/suppliers`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching suppliers');
    }
  },

  getItems: async (supplierId) => {
    try {
      const response = await axios.get(`${apiUrl}/items/${supplierId}`);
      return response.data;

    } catch (error) {
      throw new Error('Error fetching items by ID');
    }
  },

};

export default grnServices;
