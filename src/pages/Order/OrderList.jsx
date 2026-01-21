import React, { useState, useMemo, useCallback } from 'react';
import mockOrders from '../../data/mockOrders';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import Pagination from '../../components/Pagination/Pagination';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { ORDER_STATUS_OPTIONS, ORDER_STATUS } from '../../utils/orderConstants';
import { formatCurrency, formatDate } from '../../utils/orderUtils';
import useOrder from '../../hooks/useOrder';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './OrderList.css';

const OrderList = ({ onSelectOrder, onCreateOrder, onEditOrder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const { orderStats: statistics, loading: isLoading } = useOrder(mockOrders);

    const itemsPerPage = 2;

    const filteredOrders = useMemo(() => {
        let filtered = mockOrders;

        // Apply search filter
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(order =>
                order.customerName.toLowerCase().includes(search) ||
                order.status.toLowerCase().includes(search) ||
                order.id.toString().includes(search) ||
                order.items.some(item => item.name.toLowerCase().includes(search))
            );
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Apply pagination
        const startIdx = (page - 1) * itemsPerPage;
        return {
            items: filtered.slice(startIdx, startIdx + itemsPerPage),
            total: filtered.length
        };
    }, [searchTerm, statusFilter, page, itemsPerPage]);

    const totalPages = Math.ceil(filteredOrders.total / itemsPerPage);

    const handleSearchChange = useCallback((value) => {
        setSearchTerm(value);
        setPage(1);
    }, []);

    const handleStatusFilterChange = useCallback((value) => {
        setStatusFilter(value);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
    }, []);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="order-list__loading">
                    <div className="order-list__loading-spinner"></div>
                    Loading orders...
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="order-list">
                {/* Header */}
                <div className="order-list__header">
                    <h1 className="order-list__title">Orders</h1>
                    <div className="order-list__actions">
                        <Button
                            onClick={onCreateOrder}
                            variant="primary"
                            icon={<AddIcon />}
                        >
                            Add Order
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                {statistics && (
                    <div className="order-list__statistics">
                        <div className="order-list__stat-card">
                            <div className="order-list__stat-title">Total Orders</div>
                            <div className="order-list__stat-value">{statistics.totalOrders}</div>
                        </div>
                        <div className="order-list__stat-card">
                            <div className="order-list__stat-title">Pending</div>
                            <div className="order-list__stat-value">{statistics.pendingOrders}</div>
                        </div>
                        <div className="order-list__stat-card">
                            <div className="order-list__stat-title">Completed</div>
                            <div className="order-list__stat-value">{statistics.completedOrders}</div>
                        </div>
                        <div className="order-list__stat-card">
                            <div className="order-list__stat-title">Total Revenue</div>
                            <div className="order-list__stat-value">{formatCurrency(statistics.totalRevenue)}</div>
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="order-list__filters">
                    <SearchAndFilter
                        searchValue={searchTerm}
                        onSearchChange={handleSearchChange}
                        filterValue={statusFilter}
                        onFilterChange={handleStatusFilterChange}
                        filterOptions={ORDER_STATUS_OPTIONS}
                        placeholder="Search orders by customer, ID, status, or item..."
                        filterPlaceholder="All Statuses"
                        showFilter={true}
                    />
                </div>

                {/* Orders Table */}
                <div className="order-list__table-container">
                    {filteredOrders.items.length > 0 ? (
                        <table className="order-list__table">
                            <thead className="order-list__table-header">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th className="order-list__actions-cell">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.items.map((order) => (
                                    <tr key={order.id} className="order-list__table-row">
                                        <td className="order-list__table-cell">
                                            <span className="order-list__order-id">#{order.id}</span>
                                        </td>
                                        <td className="order-list__table-cell">
                                            <div className="order-list__customer-info">
                                                <span className="order-list__customer-name">
                                                    {order.customerName}
                                                </span>
                                                {order.customerEmail && (
                                                    <span className="order-list__customer-email">
                                                        {order.customerEmail}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="order-list__table-cell">
                                            <span className="order-list__items-preview">
                                                {order.items.map(item => item.name).join(', ')}
                                            </span>
                                        </td>
                                        <td className="order-list__table-cell">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="order-list__table-cell">
                                            <span className="order-list__amount">
                                                {formatCurrency(order.total || order.totalAmount || 0)}
                                            </span>
                                        </td>
                                        <td className="order-list__table-cell">
                                            <span className="order-list__date">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </td>
                                        <td className="order-list__actions-cell">
                                            <div className="order-list__action-buttons">
                                                <Button
                                                    onClick={() => onSelectOrder(order.id)}
                                                    className="order-list__action-btn order-list__action-btn--view"
                                                    variant="secondary"
                                                    title="View Order"
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </Button>
                                                <Button
                                                    onClick={() => onEditOrder(order.id)}
                                                    className="order-list__action-btn order-list__action-btn--edit"
                                                    variant="secondary"
                                                    title="Edit Order"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this order?')) {
                                                            // Handle delete logic here
                                                        }
                                                    }}
                                                    className="order-list__action-btn order-list__action-btn--delete"
                                                    variant="secondary"
                                                    title="Delete Order"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="order-list__empty-state">
                            <div className="order-list__empty-icon">📦</div>
                            <h3 className="order-list__empty-title">No Orders Found</h3>
                            <p className="order-list__empty-description">
                                {searchTerm || statusFilter
                                    ? 'No orders match your current search criteria.'
                                    : 'No orders have been created yet. Create your first order to get started.'
                                }
                            </p>
                            {!searchTerm && !statusFilter && (
                                <Button onClick={onCreateOrder} variant="primary">
                                    Create First Order
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredOrders.total > itemsPerPage && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        showInfo={true}
                        showJumper={totalPages > 10}
                    />
                )}
            </div>
        </DashboardLayout>
    )
};

export default OrderList;
