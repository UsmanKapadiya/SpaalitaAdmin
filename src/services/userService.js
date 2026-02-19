
import requests from "./api";

const UserService = {
  getUserList: async (token, page, limit, searchTerm) => {
    let url = `/users?page=${page}&limit=${limit}`;
    const params = [];
    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (params.length) url += `&${params.join('&')}`;
    return requests.get(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createUser: async (token, body) => {
    return requests.post(`/users`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateUser: async (token, body, id) => {
    return requests.put(`/users/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getUserById: async (token, id) => {
    return requests.get(`/users/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  
  DeleteOrder: async (token, id) => {
    return requests.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
export default UserService;