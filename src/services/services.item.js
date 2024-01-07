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

      getItemsByUnitFilter: async (unitId) => {
        try {
          const response = await axios.get(`${apiUrl}/unit/${unitId}`);
          return response.data;
        } catch (error) {
          throw new Error('Error fetching items');
        }
      },

      getItemsByCategoryFilter: async (categoryId) => {
        try {
          const response = await axios.get(`${apiUrl}/category/${categoryId}`);
          return response.data;
        } catch (error) {
          throw new Error('Error fetching items');
        }
      },

      getItemById: async (itemId) => {
        try {
          let response = []
          const parts = itemId.split('-');
          const beforeHyphen = parts[0];
          const afterHyphen = parts[1];

          if(beforeHyphen === 'unit') {
            response = await axios.get(`${apiUrl}/unit/${afterHyphen}`);
          } else if (beforeHyphen === 'category') {
            response = await axios.get(`${apiUrl}/category/${afterHyphen}`);
          }
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