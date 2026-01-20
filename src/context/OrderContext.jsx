import React, { createContext, useContext, useState } from 'react';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  cancelOrder
} from '../services/orderService';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(getOrders());

  const addOrder = (order) => {
    const newOrder = createOrder(order);
    setOrders(getOrders());
    return newOrder;
  };

  const modifyOrder = (id, updatedFields) => {
    updateOrder(id, updatedFields);
    setOrders(getOrders());
  };

  const cancelOrderById = (id) => {
    cancelOrder(id);
    setOrders(getOrders());
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, modifyOrder, cancelOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};
