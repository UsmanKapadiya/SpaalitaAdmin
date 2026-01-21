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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './OrderList.css';
import EmptyState from '../../components/EmptyState/EmptyState';
import Table from '../../components/Table/Table';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import PageTitle from '../../components/PageTitle/PageTitle';

const OrderList = ({ onSelectOrder, onCreateOrder, onEditOrder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const { orderStats: statistics, loading: isLoading } = useOrder(mockOrders);

    const itemsPerPage = 3;

    // State for confirm dialog
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        // TODO: Replace with actual delete logic
        // Example: setOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
        setConfirmOpen(false);
        setOrderToDelete(null);
    };

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
            <div className="news-page">
                <PageTitle
                    title="Orders"
                    subTitle="Manage all order."
                    button={true}
                    buttonLabel="Add Order"
                    onButtonClick={onCreateOrder}
                />

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
                        <Table
                            tableClassName="order-list__table"
                            theadClassName="order-list__table-header"
                            tbodyClassName=""
                            trClassName="order-list__table-row"
                            thClassName=""
                            tdClassName="order-list__table-cell"
                            columns={[
                                {
                                    key: 'id',
                                    label: 'Order ID',
                                    render: (value, row) => (
                                        <span className="order-list__order-id">#{row.id}</span>
                                    ),
                                },
                                {
                                    key: 'customer',
                                    label: 'Customer',
                                    render: (value, row) => (
                                        <div className="order-list__customer-info">
                                            <span className="order-list__customer-name">{row.customerName}</span>
                                            {row.customerEmail && (
                                                <span className="order-list__customer-email">{row.customerEmail}</span>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    key: 'items',
                                    label: 'Items',
                                    render: (value, row) => (
                                        <span className="order-list__items-preview">{row.items.map(item => item.name).join(', ')}</span>
                                    ),
                                },
                                {
                                    key: 'status',
                                    label: 'Status',
                                    render: (value, row) => <StatusBadge status={row.status} />,
                                },
                                {
                                    key: 'amount',
                                    label: 'Amount',
                                    render: (value, row) => (
                                        <span className="order-list__amount">{formatCurrency(row.total || row.totalAmount || 0)}</span>
                                    ),
                                },
                                {
                                    key: 'date',
                                    label: 'Date',
                                    render: (value, row) => (
                                        <span className="order-list__date">{formatDate(row.createdAt)}</span>
                                    ),
                                },
                                {
                                    key: 'actions',
                                    label: <span className="order-list__actions-cell">Actions</span>,
                                    thClassName: 'order-list__actions-cell',
                                    tdClassName: 'order-list__actions-cell',
                                    render: (value, row) => (
                                        <div className="order-list__action-buttons">
                                            <Button
                                                onClick={() => onSelectOrder(row.id)}
                                                className="order-list__action-btn order-list__action-btn--view"
                                                variant="secondary"
                                                title="View Order"
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </Button>
                                            <Button
                                                onClick={() => onEditOrder(row.id)}
                                                className="order-list__action-btn order-list__action-btn--edit"
                                                variant="secondary"
                                                title="Edit Order"
                                            >
                                                <EditIcon fontSize="small" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteClick(row)}
                                                className="order-list__action-btn order-list__action-btn--delete"
                                                variant="secondary"
                                                title="Delete Order"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                        </div>
                                    ),
                                },
                            ]}
                            data={filteredOrders.items}
                        />
                    ) : (
                        <EmptyState
                            icon={<ShoppingCartIcon style={{ fontSize: 48 }} />}
                            title="No Orders Found"
                            description={
                                searchTerm || statusFilter
                                    ? 'No orders match your current search criteria.'
                                    : 'No orders have been created yet. Create your first order to get started.'
                            }
                        />
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
        {/* Confirm Delete Dialog */}
        <ConfirmDialog
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Order"
            message={orderToDelete ? `Are you sure you want to delete order #${orderToDelete.id}?` : ''}
            confirmText="Delete"
            cancelText="Cancel"
            type="danger"
        />
        </DashboardLayout>
    )
};

export default OrderList;
