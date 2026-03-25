import requests from './api';

const DashBordService = {
  getDashboardStats: async () => {
    try {
      const res = await requests.get("/dashboard");
      return res;
    } catch (error) {
      throw error;
    }
  }, 
};

export default DashBordService;
