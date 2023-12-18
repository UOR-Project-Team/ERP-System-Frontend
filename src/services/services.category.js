import axios from 'axios';
const apiUrl = 'http://localhost:8081/category';

const categoryServices = {
  
  createCategory: async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/create`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error creating category');
    }
  },

  getAllCategories: async () => {
    try {
      const response = await axios.get(`${apiUrl}`);
      return response.data.categories;
    } catch (error) {
      throw new Error('Error fetching categories');
    }
  },

  getCategoryById: async (categoryId) => {
    try {
      const response = await axios.get(`${apiUrl}/${categoryId}`);
      return response.data;

    } catch (error) {
      throw new Error('Error fetching category by ID');
    }
  },

  updateCategory: async (categoryId, data) => {
    try {
      const response = await axios.put(`${apiUrl}/${categoryId}`, data, {
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
      const response = await axios.delete(`${apiUrl}/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  },

};

export default categoryServices;
