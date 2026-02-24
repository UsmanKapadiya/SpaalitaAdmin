import requests from './api';

const API_BASE = '/monthly-special';

export const createMonthlySpecial = async (token, data) => {
  try {
    const response = await requests.post(API_BASE, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response };
  } catch (error) {
    // Prefer API error message if present
    const apiMsg = error?.response?.data?.message;
    return { success: false, error: error.message || 'Failed to create monthly special', message: apiMsg };
  }
};

export const updateMonthlySpecial = async (id, token, data) => {
  try {
    const response = await requests.put(`${API_BASE}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response };
  } catch (error) {
    const apiMsg = error?.response?.data?.message;
    return { success: false, error: error.message || 'Failed to update monthly special', message: apiMsg };
  }
};


export const getAllMonthlySpecial = async (page, limit, searchTerm) => {
  try {
    let url = `${API_BASE}?page=${page}&limit=${limit}`;
    const params = [];
    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (params.length) url += `&${params.join('&')}`;
    console.log(requests.get(url));
    return await requests.get(url);
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch products' };
  }
};

export const getMonthlySpecilById = async (id, token) => {
  try {
    return await requests.get(`${API_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch product' };
  }
};


export const deleteMonthlySpecial = async (id,token) => {
  try {
    return await requests.delete(`${API_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete news item' };
  }
};

