import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import useOrder from '../../hooks/useOrder';
import mockOrders from '../../data/mockOrders';
import { DEFAULT_ORDER, ORDER_STATUS_OPTIONS } from '../../utils/orderConstants';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EditIcon from '@mui/icons-material/Edit';
import './OrderForm.css';
import PageTitle from '../../components/PageTitle/PageTitle';

const OrderForm = ({ orderId, onSave, onCancel }) => {
    const { orders, getOrderById, createOrder, updateOrder } = useOrder(mockOrders);
    const [form, setForm] = useState(DEFAULT_ORDER);
    const [editBilling, setEditBilling] = useState(false);
    const [editShipping, setEditShipping] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (orderId) {
            const order = getOrderById(orderId);
            if (order) {
                setForm({
                    ...DEFAULT_ORDER,
                    ...order,
                    // Ensure addresses exist with defaults
                    billingAddress: {
                        ...DEFAULT_ORDER.billingAddress,
                        ...(order.billingAddress || {})
                    },
                    shippingAddress: {
                        ...DEFAULT_ORDER.shippingAddress,
                        ...(order.shippingAddress || {})
                    }
                });
            } else {
                console.warn(`Order with ID ${orderId} not found`);
                setForm(DEFAULT_ORDER);
            }
        } else {
            setForm(DEFAULT_ORDER);
        }
    }, [orderId, getOrderById]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (type, field, value) => {
        setForm(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    // For simplicity, items and total are handled as text fields
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (orderId) {
                // Update existing order
                const success = await updateOrder(orderId, form);
                if (success) {
                    console.log('Updated Order:', form);
                    onSave();
                } else {
                    console.error('Failed to update order');
                }
            } else {
                // Create new order
                const newOrder = {
                    ...form,
                    id: Date.now(),
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    total: form.total || 0
                };
                const success = await createOrder(newOrder);
                if (success) {
                    console.log('Created Order:', newOrder);
                    onSave();
                } else {
                    console.error('Failed to create order');
                }
            }
        } catch (error) {
            console.error('Error saving order:', error);
        } finally {
            setLoading(false);
        }
    };
    console.log(form)
    return (
        <DashboardLayout>
            <div className="form-card">
                <PageTitle
                    title={orderId ? 'Edit Order' : 'Create Order'}                    
                />
                <form onSubmit={handleSubmit} className="order-form">            
                    <section className="order-form-section">
                        <h3 className="order-form-section-title">
                            Order #{form?.orderId} details<br />
                            Payment via Credit / Debit Card ({form?.paymentOption}).
                            {/* Paid on May 4, 2024 @ 2:10 pm. */}
                        </h3>
                    </section>
                    {/* Billing & Shipping Address */}
                    <div className="order-form-row">
                        <div className='news-item'>
                            <div className="news-item-header">
                                <span className="news-item-header-title">
                                    <span style={{ fontWeight: 600, fontSize: 18 }}>General</span>
                                </span>
                            </div>
                            <div className="address-fields">
                                <label className="address-label" style={{ marginBottom: 4 }}>Date Created</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {/* Date input */}
                                    <input
                                        type="date"
                                        value={form.createdAt ? form.createdAt.slice(0, 10) : ''}
                                        onChange={e => {
                                            const date = e.target.value;
                                            let time = form.createdAt ? form.createdAt.slice(11, 16) : '00:00';
                                            setForm(f => ({ ...f, createdAt: date ? `${date}T${time}:00Z` : '' }));
                                        }}
                                        className="address-input"
                                        style={{ fontSize: 16, minWidth: 120 }}
                                    />
                                    <span>@</span>
                                    {/* Time input */}
                                    <input
                                        type="time"
                                        value={form.createdAt ? form.createdAt.slice(11, 16) : ''}
                                        onChange={e => {
                                            const time = e.target.value;
                                            let date = form.createdAt ? form.createdAt.slice(0, 10) : '';
                                            setForm(f => ({ ...f, createdAt: date && time ? `${date}T${time}:00Z` : '' }));
                                        }}
                                        className="address-input"
                                        style={{ fontSize: 16, minWidth: 80 }}
                                    />
                                </div>
                                <label className="address-label" style={{ marginBottom: 4 }}>Status</label>
                                <select
                                    name="status"
                                    value={form.status || ''}
                                    onChange={handleChange}
                                    className="address-input"
                                    style={{ fontSize: 16, minWidth: 120 }}
                                >
                                    <option value="">Select Status</option>
                                    {ORDER_STATUS_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='news-item'>
                            <div className="news-item-header">
                                <span className="news-item-header-title">
                                    <HomeIcon style={{ marginRight: 8 }} />
                                    <span style={{ fontWeight: 600, fontSize: 18 }}>Billing Address</span>
                                </span>
                                <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Edit Billing Address" onClick={() => setEditBilling(e => !e)}>
                                    <EditIcon style={{ fontSize: 22 }} />
                                </span>
                            </div>
                            <div className="address-fields">
                                {editBilling ? (
                                    <div className="address-fields-edit">
                                        <div>
                                            <label className="address-label">First Name</label>
                                            <input
                                                type="text"
                                                value={form.billingAddress?.firstName || ''}
                                                onChange={e => handleAddressChange('billingAddress', 'firstName', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">Last Name</label>
                                            <input
                                                type="text"
                                                value={form.billingAddress?.lastName || ''}
                                                onChange={e => handleAddressChange('billingAddress', 'lastName', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">Address</label>
                                            <input
                                                type="text"
                                                value={form.billingAddress?.address || ''}
                                                onChange={e => handleAddressChange('billingAddress', 'address', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">City</label>
                                            <input
                                                type="text"
                                                value={form.billingAddress?.city || ''}
                                                onChange={e => handleAddressChange('billingAddress', 'city', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">ZIP</label>
                                            <input
                                                type="text"
                                                value={form.billingAddress?.zip || ''}
                                                onChange={e => handleAddressChange('billingAddress', 'zip', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">Country</label>
                                            <input
                                                type="text"
                                                value={form.billingAddress?.country || ''}
                                                onChange={e => handleAddressChange('billingAddress', 'country', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">State</label>
                                            <input
                                                type="text"
                                                value={form.billingAddress?.state || ''}
                                                onChange={e => handleAddressChange('billingAddress', 'state', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">Email Address</label>
                                            <input
                                                type="email"
                                                value={form.billingAddress?.email || ''}
                                                onChange={e => handleAddressChange('billingAddress', 'email', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">Phone</label>
                                            <input
                                                type="text"
                                                value={form.billingAddress?.phone || ''}
                                                onChange={e => handleAddressChange('billingAddress', 'phone', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            {form.billingAddress?.firstName}  {form.billingAddress?.lastName}<br />
                                            {form.billingAddress?.address}<br />
                                            {form.billingAddress?.city} {form.billingAddress?.zip}<br />
                                            {form.billingAddress?.country} {form.billingAddress?.state}
                                        </div>
                                        <div style={{ marginTop: 5 }}>
                                            <label className="address-label">Email Address</label> <br />
                                            {form?.billingAddress?.email}
                                        </div>
                                        <div style={{ marginTop: 5 }}>
                                            <label className="address-label">Phone</label> <br />
                                            {form?.billingAddress?.phone}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='news-item'>
                            <div className="news-item-header">
                                <span className="news-item-header-title">
                                    <LocalShippingIcon style={{ marginRight: 8 }} />
                                    <span style={{ fontWeight: 600, fontSize: 18 }}>Shipping Address</span>
                                </span>
                                <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Edit Shipping Address" onClick={() => setEditShipping(e => !e)}>
                                    <EditIcon style={{ fontSize: 22 }} />
                                </span>
                            </div>
                            <div className="address-fields">
                                {editShipping ? (
                                    <div className="address-fields-edit">
                                        <div>
                                            <label className="address-label">First Name</label>
                                            <input
                                                type="text"
                                                value={form.shippingAddress?.firstName || ''}
                                                onChange={e => handleAddressChange('shippingAddress', 'firstName', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">Last Name</label>
                                            <input
                                                type="text"
                                                value={form.shippingAddress?.lastName || ''}
                                                onChange={e => handleAddressChange('shippingAddress', 'lastName', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">Address</label>
                                            <input
                                                type="text"
                                                value={form.shippingAddress?.address || ''}
                                                onChange={e => handleAddressChange('shippingAddress', 'address', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">City</label>
                                            <input
                                                type="text"
                                                value={form.shippingAddress?.city || ''}
                                                onChange={e => handleAddressChange('shippingAddress', 'city', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">ZIP</label>
                                            <input
                                                type="text"
                                                value={form.shippingAddress?.zip || ''}
                                                onChange={e => handleAddressChange('shippingAddress', 'zip', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">Country</label>
                                            <input
                                                type="text"
                                                value={form.shippingAddress?.country || ''}
                                                onChange={e => handleAddressChange('shippingAddress', 'country', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">State</label>
                                            <input
                                                type="text"
                                                value={form.shippingAddress?.state || ''}
                                                onChange={e => handleAddressChange('shippingAddress', 'state', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">Email Address</label>
                                            <input
                                                type="email"
                                                value={form.shippingAddress?.email || ''}
                                                onChange={e => handleAddressChange('shippingAddress', 'email', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="address-label">Phone</label>
                                            <input
                                                type="text"
                                                value={form.shippingAddress?.phone || ''}
                                                onChange={e => handleAddressChange('shippingAddress', 'phone', e.target.value)}
                                                className="address-input"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            {form.shippingAddress?.firstName}  {form.shippingAddress?.lastName}<br />
                                            {form.shippingAddress?.address}<br />
                                            {form.shippingAddress?.city} {form.shippingAddress?.zip}<br />
                                            {form.shippingAddress?.country} {form.shippingAddress?.state}
                                        </div>
                                        <div style={{ marginTop: 5 }}>
                                            <label className="address-label">Email Address</label> <br />
                                            {form?.shippingAddress?.email}
                                        </div>
                                        <div style={{ marginTop: 5 }}>
                                            <label className="address-label">Phone</label> <br />
                                            {form?.shippingAddress?.phone}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {Array.isArray(form?.items) && form.items.length > 0 && (
                        <div className='order-form-row'>
                            <div className='news-item'>
                                <table style={{ width: '100%', textAlign: 'left' }}>
                                    <thead className="order-items-thead">
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Qty</th>
                                            <th style={{ textAlign: 'right' }}>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="order-items-tbody">
                                        {form.items.map((item, idx) => (
                                            <tr className="order-item-row" key={idx}>
                                                <td>{item.image && <img src={item.image} alt={item.name} style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover', border: '1px solid #eee' }} />}</td>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td className="order-item-price">${item.price}</td>
                                            </tr>
                                        ))}
                                        {/* Subtotal row */}
                                        <tr className="order-summary-row">
                                            <td colSpan={2}></td>
                                            <td className="order-summary-label">Item Subtotal:</td>
                                            <td className="order-summary-value order-item-price">
                                                ${form.items.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0).toFixed(2)}
                                            </td>
                                        </tr>
                                        {/* Shipping row */}
                                        <tr className="order-summary-row">
                                            <td colSpan={2}></td>
                                            <td className="order-summary-label">
                                                <LocalShippingIcon style={{ marginRight: 10 }} />
                                                Shipping
                                            </td>
                                            <td className="order-summary-value order-item-price">
                                                {form.shippingPrice !== undefined && form.shippingPrice !== null
                                                    ? `$${parseFloat(form.shippingPrice).toFixed(2)}`
                                                    : '$0.00'}
                                            </td>
                                        </tr>
                                        {/* Order Total row */}
                                        <tr className="order-summary-row order-total-row">
                                            <td colSpan={2}></td>
                                            <td className="order-summary-label">Order Total:</td>
                                            <td className="order-summary-value order-item-price">
                                                ${(
                                                    form.items.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0) +
                                                    (parseFloat(form.shippingPrice) || 0)
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        {/* Paid row */}
                                        {/* <tr className="order-summary-row">
                                            <td colSpan={2}></td>
                                            <td className="order-summary-label">Paid:</td>
                                            <td className="order-summary-value order-item-price">
                                                ${(
                                                    form.paidAmount !== undefined && form.paidAmount !== null
                                                        ? parseFloat(form.paidAmount).toFixed(2)
                                                        : '0.00'
                                                )}
                                            </td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <div className="form-actions">
                        <Button
                            type="submit"
                            className="btn-add"
                            disabled={loading}
                        >
                            {loading ? (orderId ? 'Updating...' : 'Creating...') : (orderId ? 'Update' : 'Create')}
                        </Button>
                        <Button
                            type="button"
                            className="btn-secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default OrderForm;
