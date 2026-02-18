import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import Pagination from '../../components/Pagination/Pagination';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { ORDER_STATUS_OPTIONS, ORDER_STATUS } from '../../utils/orderConstants';
import { formatCurrency, formatDate } from '../../utils/orderUtils';
import useOrder from '../../hooks/useOrder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './OrderList.css';
import EmptyState from '../../components/EmptyState/EmptyState';
import Table from '../../components/Table/Table';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import PageTitle from '../../components/PageTitle/PageTitle';
import GlobalLoader from '../../components/Loader/GlobalLoader';
import OrderService from '../../services/orderService';
import { toast } from 'react-toastify';

const OrderList = ({ onSelectOrder, onCreateOrder, onEditOrder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const { orderStats: statistics, loading: isLoading } = useOrder(orders);
    const itemsPerPage = 10;

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetchOrder();
    }, [page, searchTerm, statusFilter]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
            const resp = await OrderService.getOrderList(token, page, itemsPerPage, searchTerm, statusFilter);
            if (resp?.success) {
                setOrders(resp.data || []);
                setTotalPages(resp.pagination?.totalPages || 1);
                setTotalOrders(resp.pagination?.total || 0);
            } else {
                notifyError("Please try again.");
            }
        } catch (error) {
            notifyError("An error occurred during fetch Data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!orderToDelete || !orderToDelete._id) {
            setConfirmOpen(false);
            setOrderToDelete(null);
            return;
        }
        try {
            const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
            const resp = await OrderService.DeleteOrder(token, orderToDelete._id);
            if (resp?.success) {
                toast.success(resp?.message, {
                    position: 'top-right',
                    autoClose: 3000,
                });
                setOrders(prev => prev.filter(o => o._id !== orderToDelete._id));

            }
            else {
                console.error('Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        } finally {
            setConfirmOpen(false);
            setOrderToDelete(null);
        }
    };

    // Filtering and pagination for API data
    // No local filtering, server does it
    const filteredOrders = useMemo(() => {
        return {
            items: orders,
            total: totalOrders
        };
    }, [orders, totalOrders]);

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

    return (
        <DashboardLayout>
            <div className="news-page">
                <PageTitle
                    title="Orders"
                    subTitle="Manage all order."
                    button={true}
                    buttonLabel="Add Order"
                    onButtonClick={onCreateOrder}
                    addBtnDisable={true}
                />
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
                <div className="order-list__table-container">
                    {loading ? (
                        <GlobalLoader text="Loading orders..." />
                    ) : filteredOrders.items.length > 0 ? (
                        <Table
                            tableClassName="order-list__table"
                            theadClassName="order-list__table-header"
                            tbodyClassName=""
                            trClassName="order-list__table-row"
                            thClassName=""
                            tdClassName="order-list__table-cell"
                            columns={[
                                {
                                    key: '_id',
                                    label: 'Order ID',
                                    render: (value, row) => {
                                        const id = row._id || '';
                                        const shortId = id.length > 4 ? `${id.slice(0, 2)}...${id.slice(-2)}` : id;
                                        return (
                                            <span className="order-list__order-id">#{shortId}</span>
                                        );
                                    },
                                },
                                {
                                    key: 'customer',
                                    label: 'Customer',
                                    render: (value, row) => (
                                        <div className="order-list__customer-info">
                                            <span className="order-list__customer-name">{row.user?.userName || row.user?.username || 'N/A'}</span>
                                        </div>
                                    ),
                                },
                                {
                                    key: 'items',
                                    label: 'Items',
                                    render: (value, row) => (
                                        <span className="order-list__items-preview">{row.items?.map(item => item.productId?.productName || item.productName || '').join(', ')}</span>
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
                                        <span className="order-list__amount">{formatCurrency(row.totalAmount || row.total || 0)}</span>
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
                                                onClick={() => onSelectOrder(row)}
                                                className="btn-icon edit"
                                                variant="secondary"
                                                title="View Order"
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </Button>
                                            <Button
                                                onClick={() => onEditOrder(row)}
                                                className="btn-icon edit"
                                                variant="secondary"
                                                title="Edit Order"
                                            >
                                                <EditIcon fontSize="small" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteClick(row)}
                                                className="btn-icon edit"
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
                {totalPages > 1 && !loading && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        showInfo={true}
                        showJumper={totalPages > 10}
                    />
                )}
            </div>
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Order"
                message={orderToDelete ? `Are you sure you want to delete order #${orderToDelete._id}?` : ''}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </DashboardLayout>
    )
};

export default OrderList;
