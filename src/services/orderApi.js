import apiClient from './api';

const API_ENDPOINTS = {
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  ORDER_ITEMS: (id) => `/orders/${id}/items`,
  ORDER_STATUS: (id) => `/orders/${id}/status`
};

/**
 * Order Service - Handles all order-related API calls
 */
class OrderService {
  /**
   * Get all orders with pagination and filters
   */
  static async getOrders({
    page = 1,
    limit = 10,
    status = '',
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    dateFrom = '',
    dateTo = ''
  } = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (status) params.append('status', status);
      if (search) params.append('search', search);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await apiClient(`${API_ENDPOINTS.ORDERS}?${params}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch orders'
      };
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(id) {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      const response = await apiClient(API_ENDPOINTS.ORDER_BY_ID(id));
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch order details'
      };
    }
  }

  /**
   * Create new order
   */
  static async createOrder(orderData) {
    try {
      if (!orderData) {
        throw new Error('Order data is required');
      }

      // Validate required fields
      const requiredFields = ['customerName', 'items', 'billingAddress'];
      for (const field of requiredFields) {
        if (!orderData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      const response = await apiClient(API_ENDPOINTS.ORDERS, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create order'
      };
    }
  }

  /**
   * Update existing order
   */
  static async updateOrder(id, orderData) {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      if (!orderData) {
        throw new Error('Order data is required');
      }

      const response = await apiClient(API_ENDPOINTS.ORDER_BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify({
          ...orderData,
          updatedAt: new Date().toISOString()
        })
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update order'
      };
    }
  }

  /**
   * Update order status only
   */
  static async updateOrderStatus(id, status, notes = '') {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      if (!status) {
        throw new Error('Status is required');
      }

      const response = await apiClient(API_ENDPOINTS.ORDER_STATUS(id), {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          notes,
          updatedAt: new Date().toISOString()
        })
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update order status'
      };
    }
  }

  /**
   * Delete order
   */
  static async deleteOrder(id) {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      const response = await apiClient(API_ENDPOINTS.ORDER_BY_ID(id), {
        method: 'DELETE'
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete order'
      };
    }
  }

  /**
   * Get order statistics
   */
  static async getOrderStats(dateFrom = '', dateTo = '') {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await apiClient(`${API_ENDPOINTS.ORDERS}/stats?${params}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch order statistics'
      };
    }
  }

  /**
   * Export orders to CSV
   */
  static async exportOrders(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await apiClient(`${API_ENDPOINTS.ORDERS}/export?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv'
        }
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to export orders'
      };
    }
  }

  /**
   * Search orders by customer or order ID
   */
  static async searchOrders(query, limit = 10) {
    try {
      if (!query || query.trim().length < 2) {
        return { success: true, data: [] };
      }

      const params = new URLSearchParams({
        search: query.trim(),
        limit: limit.toString()
      });

      const response = await apiClient(`${API_ENDPOINTS.ORDERS}/search?${params}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to search orders'
      };
    }
  }
}

export default OrderService;