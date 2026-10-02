import requests from './api';

const API_BASE = '/gallery';

export const getAllGallery = async (searchTerm) => {
  try {
    let url = `${API_BASE}`;
    const params = [];
    // The API filters by a full dd-mm-yyyy date; a partial date lists every image
    const date = searchTerm?.trim();
    if (date && /^\d{2}-\d{2}-\d{4}$/.test(date)) params.push(`date=${encodeURIComponent(date)}`);
    if (params.length) url += `?${params.join('&')}`;
    return await requests.get(url);
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message || 'Failed to fetch products'
    };
  }
};

export const createGallery = async (formData, token) => {
  try {
    return await requests.post(`${API_BASE}/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message || 'Failed to create gallery item'
    };
  }
};

export const updateGallery = async (id, formData, token) => {
  try {
    return await requests.put(`${API_BASE}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update gallery item",
    };
  }
};

export const deleteGallery = async (id, token) => {
  try {
    return await requests.delete(`${API_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message || 'Failed to delete gallery item'
    };
  }
};




