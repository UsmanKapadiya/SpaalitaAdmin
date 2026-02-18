import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import OrderForm from './OrderForm';

const OrderPage = () => {
  const [view, setView] = useState('list'); // 'list' | 'details' | 'edit'
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewOrder = useCallback((order) => {
    setSelectedOrder(order);
    setView('details');
  }, []);

  const handleEditOrder = useCallback((order) => {
    setSelectedOrder(order);
    setView('edit');
  }, []);

  const handleCreateOrder = useCallback(() => {
    setSelectedOrder(null);
    setView('edit');
  }, []);

  const handleSaveOrder = useCallback(() => {
    setView('list');
    setSelectedOrder(null);
  }, []);

  const handleBack = useCallback(() => {
    setView('list');
    setSelectedOrder(null);
  }, []);

  if (view === 'details' && selectedOrder) {
    return (
      <OrderDetails 
        order={selectedOrder} 
        onEditOrder={handleEditOrder} 
        onBack={handleBack}
      />
    );
  }

  if (view === 'edit' && selectedOrder) {
    console.log("Edit selectedOrder", selectedOrder)
    return (
      <OrderForm 
        order={selectedOrder} 
        onSave={handleSaveOrder} 
        onCancel={handleBack}
      />
    );
  }

  return (
    <OrderList 
      onSelectOrder={handleViewOrder} 
      onCreateOrder={handleCreateOrder} 
      onEditOrder={handleEditOrder}
    />
  )
};

export default OrderPage;
