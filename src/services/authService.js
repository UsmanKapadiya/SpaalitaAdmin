import requests from './api';

const AuthService = {
  adminLogin: async (body) => {
    try {
      const res = await requests.post("/admin/login", body);
      return res;
    } catch (error) {
      throw error;
    }
  },

  adminLogout: async () => {
    try {
      const res = await requests.post("/admin/logout");
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

export default AuthService;