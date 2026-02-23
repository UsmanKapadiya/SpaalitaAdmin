import requests from './api';

const BASE_URL = '/booking-policies';

export const createBookingPolicy = async (token, formData) => {
    try {
        const response = await requests.post(BASE_URL, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message || 'Failed to create service' };
    }
};

export const updateBookingPolicy = async (id, token, serviceData) => {
    try {
        const response = await requests.put(`${BASE_URL}/${id}`, serviceData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message || 'Failed to update service' };
    }
};

export const getAllBookingPolicy = async (page, limit, searchTerm) => {
  try {
    let url = `${BASE_URL}?page=${page}&limit=${limit}`;
    const params = [];
    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (params.length) url += `&${params.join('&')}`;
    return await requests.get(url);
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch products' };
  }
};

export const getBookingPolicyById = async (id, token) => {
  try {
    return await requests.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch product' };
  }
};


export const deleteBookingPolicy = async (id,token) => {
  try {
    return await requests.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete news item' };
  }
};
