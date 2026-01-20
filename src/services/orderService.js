import mockOrders from '../data/mockOrders';

let orders = [...mockOrders];

export const getOrders = () => orders;

export const getOrderById = (id) => orders.find(order => order.id === id);

export const createOrder = (order) => {
  const newOrder = { ...order, id: Date.now(), status: 'Pending', createdAt: new Date().toISOString() };
  orders.push(newOrder);
  return newOrder;
};

export const updateOrder = (id, updatedFields) => {
  const idx = orders.findIndex(order => order.id === id);
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], ...updatedFields };
    return orders[idx];
  }
  return null;
};

export const cancelOrder = (id) => {
  return updateOrder(id, { status: 'Cancelled' });
};
