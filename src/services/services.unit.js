import axios from 'axios';
const apiUrl = 'http://localhost:8081/unit';

const unitServices = {
  
  createUnit: async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/create`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error creating unit');
    }
  },

  getAllUnits: async () => {
    try {
      const response = await axios.get(`${apiUrl}`);
      return response.data.units;
    } catch (error) {
      throw new Error('Error fetching units');
    }
  },

  getUnitById: async (unitId) => {
    try {
      const response = await axios.get(`${apiUrl}/${unitId}`);
      return response.data;

    } catch (error) {
      throw new Error('Error fetching unit by ID');
    }
  },

  updateUnit: async (unitId, data) => {
    try {
      const response = await axios.put(`${apiUrl}/${unitId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error updating unit: ${error.message}`);
    }
  },


  deleteUnit: async (unitId) => {
    try {
      const response = await axios.delete(`${apiUrl}/${unitId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting unit: ${error.message}`);
    }
  },

};

export default unitServices;
