import connection from "../connection";

const categoryServices = {
  
  createCategory: async (data) => {
    try {
      const response = await connection.post(`/category/create`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllCategories: async () => {
    try {
      const response = await connection.get(`/category`);
      return response.data.categories;
    } catch (error) {
      throw new Error('Error fetching categories');
    }
  },

  getCategoryById: async (categoryId) => {
    try {
      const response = await connection.get(`/category/${categoryId}`);
      return response.data;

    } catch (error) {
      throw new Error('Error fetching category by ID');
    }
  },

  updateCategory: async (categoryId, data) => {
    try {
      const response = await connection.put(`/category/${categoryId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  },


  deleteCategory: async (categoryId) => {
    try {
      const response = await connection.delete(`/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  },

};

export default categoryServices;
