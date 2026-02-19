import requests from './api';

const PRODUCT_BASE = '/products';


export const createProduct = async (token, formData) => {
  try {
    return await requests.post(PRODUCT_BASE, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create product' };
  }
};


export const updateProduct = async (id, token, productData) => {
  try {
    return await requests.put(`${PRODUCT_BASE}/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update product' };
  }
};



export const getProducts = async (page, limit, searchTerm) => {
  try {
    let url = `${PRODUCT_BASE}?page=${page}&limit=${limit}`;
    const params = [];
    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (params.length) url += `&${params.join('&')}`;
    return await requests.get(url);
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch products' };
  }
};


export const getProductById = async (id, token) => {
  try {
    return await requests.get(`${PRODUCT_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch product' };
  }
};

export const deleteProduct = async (id,token) => {
  try {
    return await requests.delete(`${PRODUCT_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete news item' };
  }
};
