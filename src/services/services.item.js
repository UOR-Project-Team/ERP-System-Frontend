import axios from 'axios';
const apiUrl = 'http://localhost:8081/item';

const itemServices ={

    createItem: async (data) => {
        try {
          const response = await axios.post(`${apiUrl}/create`, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          return response.data;
        } catch (error) {
          throw error;
        }
      },

      getAllItems: async () => {
        try {
          const response = await axios.get(`${apiUrl}`);
          return response.data;
        } catch (error) {
          throw new Error('Error fetching items');
        }
      },

      getItemById: async (itemId) => {
        try {
          const response = await axios.get(`${apiUrl}/${itemId}`);
          return response.data;
        } catch (error) {
          throw new Error('Error fetching item by ID');
        }
      },
    
      updateItem: async (itemId, data) => {
        try {
          const response = await axios.put(`${apiUrl}/${itemId}`, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          return response.data;
        } catch (error) {
          throw error;
        }
      },
    
      deleteItem: async (itemId) => {
        try {
          const response = await axios.delete(`${apiUrl}/${itemId}`);
          return response.data;
        } catch (error) {
          throw new Error(`Error deleting item: ${error.message}`);
        }
      },



}

export default itemServices;