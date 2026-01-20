
import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
const OrderDetails = ({ order, onBack, onEditOrder, orders }) => {
    console.log(order)
    if (!order) {
        return (
            <DashboardLayout>
                <div className="order-details-container">
                    <h2>Order Not Found</h2>
                    <Button onClick={onBack} variant="secondary">Back to Orders</Button>
                </div>
            </DashboardLayout>
        );
    }
    return (
        <DashboardLayout>
            <div className="order-details-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Order Details</h2>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Button onClick={onBack} variant="secondary">Back to Orders</Button>
                        <Button
                            className="btn-add"
                            onClick={() => onEditOrder(order.id)}
                            variant="primary"
                            disabled={order.status === 'Cancelled' || order.status === 'Completed'}
                        >
                            <EditIcon style={{ marginRight: 6 }} />
                            Edit Order
                        </Button>
                    </div>
                </div>
                <table className="product-table news-item" style={{ margin: '24px auto', width: '100%', overflow: 'hidden', borderCollapse: 'separate' }}>
                    <tbody>
                        <tr>
                            <th style={{ width: 180 }}>Order ID</th>
                            <td>{order.id}</td>
                        </tr>
                        <tr>
                            <th>Customer</th>
                            <td>{order.customerName}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>{order.status}</td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>${order.total}</td>
                        </tr>
                        <tr>
                            <th>Created At</th>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <th>Items</th>
                            <td>
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.image && <img src={item.image} alt={item.name} style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover', border: '1px solid #eee' }} />}</td>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* Billing & Shipping Address */}
                <div style={{ display: 'flex', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
                    <div className='news-item' style={{ flex: 1, position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                            <HomeIcon style={{ color: '#1976d2', marginRight: 8 }} />
                            <span style={{ fontWeight: 600, fontSize: 18 }}>Billing Address</span>
                        </div>
                        <div style={{ color: '#333', lineHeight: 2, fontSize: 15, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div><b>Name:</b> {order.billingAddress?.name || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                            <div><b>Address:</b> {order.billingAddress?.address || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                            <div><b>City:</b> {order.billingAddress?.city || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                            <div><b>State:</b> {order.billingAddress?.state || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                            <div><b>ZIP:</b> {order.billingAddress?.zip || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                            <div><b>Country:</b> {order.billingAddress?.country || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                        </div>
                    </div>
                    <div className='news-item' style={{ flex: 1, position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                            <LocalShippingIcon style={{ color: '#43a047', marginRight: 8 }} />
                            <span style={{ fontWeight: 600, fontSize: 18 }}>Shipping Address</span>
                        </div>
                        <div style={{ color: '#333', lineHeight: 2, fontSize: 15, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div><b>Name:</b> {order.shippingAddress?.name || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                            <div><b>Address:</b> {order.shippingAddress?.address || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                            <div><b>City:</b> {order.shippingAddress?.city || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                            <div><b>State:</b> {order.shippingAddress?.state || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                            <div><b>ZIP:</b> {order.shippingAddress?.zip || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                            <div><b>Country:</b> {order.shippingAddress?.country || <span style={{ color: '#aaa' }}>Not Provided</span>}</div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OrderDetails;
