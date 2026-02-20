import requests from './api';

const SERVICE_BASE = '/services';

export const createService = async (token, formData) => {
    try {
        const response = await requests.post(SERVICE_BASE, formData, {
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

export const updateService = async (id, token, serviceData) => {
    try {
        const response = await requests.put(`${SERVICE_BASE}/${id}`, serviceData, {
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

export const getAllServices = async (page, limit, searchTerm) => {
  try {
    let url = `${SERVICE_BASE}?page=${page}&limit=${limit}`;
    const params = [];
    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (params.length) url += `&${params.join('&')}`;
    return await requests.get(url);
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch products' };
  }
};

export const getServiceById = async (id, token) => {
  try {
    return await requests.get(`${SERVICE_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch product' };
  }
};


export const deleteServices = async (id,token) => {
  try {
    return await requests.delete(`${SERVICE_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete news item' };
  }
};
