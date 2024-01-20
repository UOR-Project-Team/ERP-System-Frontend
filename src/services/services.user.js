import axios from 'axios';
const apiUrl = 'http://localhost:8081/user';

const userServices = {

  createUser: async (data) => {
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
  
  updateProfile: async (userId, data) => {
    try {
      const response = await axios.put(`${apiUrl}/profile/${userId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};

export default userServices;
