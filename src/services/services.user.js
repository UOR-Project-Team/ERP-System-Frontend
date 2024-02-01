import connection from "../connection";

const userServices = {

  createUser: async (data) => {
    try {
      const response = await connection.post(`/user/create`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserByID: async (userId) => {
    try {
      const response = await connection.get(`/user/getuser/${userId}`);
      return response;
    } catch (error) {
      throw new Error('Error fetching User by ID');
    }
  },

  getUserTokenByID: async (userId) => {
    try {
      const response = await connection.get(`/user/getUserToken/${userId}`);
      return response;
    } catch (error) {
      throw new Error('Error fetching UserToken by ID');
    }
  },
  
  updateProfile: async (userId, data) => {
    try {
      const response = await connection.put(`/user/profile/${userId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyPassword: async (userId, data) => {
    try {
      const response = await connection.post(`/user/verifyPW/${userId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updatePassword: async (userId, data) => {
    try {
      const response = await connection.put(`/user/changePW/${userId}`, data, {
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
