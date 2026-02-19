import requests from './api';

const BASE_URL = '/giftcards';


export const createGiftCard = async (token, formData) => {
  try {
    return await requests.post(BASE_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create giftCard' };
  }
};


export const updateGiftCard = async (id, token, giftCardData) => {
  try {
    return await requests.put(`${BASE_URL}/${id}`, giftCardData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update giftCard' };
  }
};



export const getGiftCards = async (page, limit, searchTerm) => {
  try {
    let url = `${BASE_URL}?page=${page}&limit=${limit}`;
    const params = [];
    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (params.length) url += `&${params.join('&')}`;
    return await requests.get(url);
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch giftCards' };
  }
};


export const getGiftCardById = async (id, token) => {
  try {
    return await requests.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch giftCard' };
  }
};

export const deleteGiftCard = async (id,token) => {
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
