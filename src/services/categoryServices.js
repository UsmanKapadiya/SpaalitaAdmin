import requests from './api';

const CATEGORY_BASE = '/category';


export const createCategory = async (token, formData) => {
  try {
    return await requests.post(CATEGORY_BASE, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create category' };
  }
};


export const updateCategory = async (id, token, categoryData) => {
  try {
    return await requests.put(`${CATEGORY_BASE}/${id}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update category' };
  }
};



export const getCategorys = async (page, limit, searchTerm) => {
  try {
    let url = `${CATEGORY_BASE}?page=${page}&limit=${limit}`;
    const params = [];
    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (params.length) url += `&${params.join('&')}`;
    return await requests.get(url);
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch categorys' };
  }
};


export const getCategoryById = async (id, token) => {
  try {
    return await requests.get(`${CATEGORY_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch category' };
  }
};

export const deleteCategory = async (id, token) => {
  try {
    return await requests.delete(`${CATEGORY_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete news item' };
  }
};
