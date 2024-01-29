import connection from "../connection";

const itemServices ={

  createItem: async (data) => {
    try {
      const response = await connection.post(`/item/create`, data, {
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
      const response = await connection.get(`/item`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching items');
    }
  },

  getItemsByUnitFilter: async (unitId) => {
    try {
      const response = await connection.get(`/item/unit/${unitId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching items');
    }
  },

  getItemsByCategoryFilter: async (categoryId) => {
    try {
      const response = await connection.get(`/item/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching items');
    }
  },

  getItemsBySupplierFilter: async (supplierId) => {
    try {
      const response = await connection.get(`/item/supplier/${supplierId}`);
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
        response = await connection.get(`/item/unit/${afterHyphen}`);
      } else if (beforeHyphen === 'category') {
        response = await connection.get(`/item/category/${afterHyphen}`);
      }
      return response.data;
    } catch (error) {
      throw new Error('Error fetching item by ID');
    }
  },

  updateItem: async (itemId, data) => {
    try {
      const response = await connection.put(`/item/${itemId}`, data, {
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
      const response = await connection.delete(`/item/${itemId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting item: ${error.message}`);
    }
  },

}

export default itemServices;