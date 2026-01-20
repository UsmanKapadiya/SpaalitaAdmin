import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import OrderForm from './OrderForm';
import useOrder from '../../hooks/useOrder';
import mockOrders from '../../data/mockOrders';
import GlobalLoader from '../../components/Loader/GlobalLoader';

const OrderPage = () => {
  const navigate = useNavigate();
  const { orders, loading, error, deleteOrder, getOrderById } = useOrder(mockOrders);
  const [view, setView] = useState('list'); // 'list' | 'details' | 'edit'
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleViewOrder = useCallback((id) => {
    console.log("Viewing order:", id);
    setSelectedOrderId(id);
    setView('details');
  }, []);

  const handleEditOrder = useCallback((id) => {
    setSelectedOrderId(id);
    setView('edit');
  }, []);

  const handleDeleteOrder = useCallback(async (id) => {
    try {
      await deleteOrder(id);
      setView('list');
      setSelectedOrderId(null);
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  }, [deleteOrder]);

  const handleCreateOrder = useCallback(() => {
    setSelectedOrderId(null);
    setView('edit');
  }, []);

  const handleSaveOrder = useCallback(() => {
    setView('list');
    setSelectedOrderId(null);
  }, []);

  const handleBack = useCallback(() => {
    setView('list');
    setSelectedOrderId(null);
  }, []);

  if (loading && view === 'list') {
    return <GlobalLoader />;
  }

  if (error) {
    return (
      <div className="error-state">
        <h2>Error Loading Orders</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  if (view === 'details' && selectedOrderId) {
    const order = getOrderById(selectedOrderId);
    if (!order) {
      return (
        <div className="error-state">
          <h2>Order Not Found</h2>
          <p>The requested order could not be found.</p>
          <Button onClick={handleBack} variant="primary">
            Back to Orders
          </Button>
        </div>
      );
    }
    return (
      <OrderDetails 
        order={order} 
        onEditOrder={handleEditOrder} 
        onBack={handleBack} 
        onDeleteOrder={handleDeleteOrder}
      />
    );
  }

  if (view === 'edit') {
    return (
      <OrderForm 
        orderId={selectedOrderId} 
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
