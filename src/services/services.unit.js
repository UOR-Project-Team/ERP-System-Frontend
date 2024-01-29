import connection from "../connection";

const unitServices = {
  
  createUnit: async (data) => {
    try {
      const response = await connection.post(`/unit/create`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllUnits: async () => {
    try {
      const response = await connection.get(`/unit`);
      return response.data.units;
    } catch (error) {
      throw new Error('Error fetching units');
    }
  },

  getUnitById: async (unitId) => {
    try {
      const response = await connection.get(`/unit/${unitId}`);
      return response.data;

    } catch (error) {
      throw new Error('Error fetching unit by ID');
    }
  },

  updateUnit: async (unitId, data) => {
    try {
      const response = await connection.put(`/unit/${unitId}`, data, {
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
      const response = await connection.delete(`/unit/${unitId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting unit: ${error.message}`);
    }
  },

};

export default unitServices;
