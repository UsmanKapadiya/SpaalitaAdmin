import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for order management
 * Provides CRUD operations, validation, and state management for orders
 */
const useOrder = (initialOrders = []) => {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate order statistics
  const orderStats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'delivered' || order.status === 'completed').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(order => order.status === 'delivered' || order.status === 'completed')
      .reduce((sum, order) => sum + parseFloat(order.totalAmount || order.total || 0), 0);

    return { 
      totalOrders, 
      pendingOrders, 
      completedOrders, 
      cancelledOrders, 
      totalRevenue 
    };
  }, [orders]);

  // Validate order data
  const validateOrder = useCallback((orderData) => {
    const errors = {};

    if (!orderData.customerName?.trim()) {
      errors.customerName = 'Customer name is required';
    }

    if (!orderData.items || orderData.items.length === 0) {
      errors.items = 'At least one item is required';
    }

    if (!orderData.billingAddress?.address?.trim()) {
      errors.billingAddress = 'Billing address is required';
    }

    if (!orderData.billingAddress?.email?.trim() || 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.billingAddress.email)) {
      errors.email = 'Valid email address is required';
    }

    if (!orderData.billingAddress?.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  // Calculate order total
  const calculateOrderTotal = useCallback((items, shippingPrice = 0) => {
    const itemsTotal = items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity || 1));
    }, 0);
    return itemsTotal + parseFloat(shippingPrice);
  }, []);

  // Create new order
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const validation = validateOrder(orderData);
      if (!validation.isValid) {
        setError(validation.errors);
        return { success: false, errors: validation.errors };
      }

      const newOrder = {
        ...orderData,
        id: Date.now(),
        orderId: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: orderData.status || 'Pending',
        total: calculateOrderTotal(orderData.items, orderData.shippingPrice)
      };

      setOrders(prev => [newOrder, ...prev]);
      toast.success('Order created successfully!');
      
      return { success: true, data: newOrder };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create order';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [validateOrder, calculateOrderTotal]);

  // Update existing order
  const updateOrder = useCallback(async (orderId, orderData) => {
    setLoading(true);
    setError(null);

    try {
      const validation = validateOrder(orderData);
      if (!validation.isValid) {
        setError(validation.errors);
        return { success: false, errors: validation.errors };
      }

      const updatedOrder = {
        ...orderData,
        updatedAt: new Date().toISOString(),
        total: calculateOrderTotal(orderData.items, orderData.shippingPrice)
      };

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, ...updatedOrder } : order
        )
      );

      toast.success('Order updated successfully!');
      return { success: true, data: updatedOrder };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update order';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [validateOrder, calculateOrderTotal]);

  // Delete order
  const deleteOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast.success('Order deleted successfully!');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete order';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get order by ID
  const getOrderById = useCallback((orderId) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  // Filter and search orders
  const filterOrders = useCallback((searchTerm = '', status = '', dateRange = null) => {
    return orders.filter(order => {
      // Text search
      const matchesSearch = !searchTerm || 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filter
      const matchesStatus = !status || order.status === status;

      // Date range filter
      const matchesDate = !dateRange || (
        new Date(order.createdAt) >= new Date(dateRange.start) &&
        new Date(order.createdAt) <= new Date(dateRange.end)
      );

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders]);

  return {
    orders,
    setOrders,
    loading,
    error,
    orderStats,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    filterOrders,
    validateOrder,
    calculateOrderTotal
  };
};

export default useOrder;