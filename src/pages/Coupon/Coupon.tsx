import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Button from '../../components/Button/Button';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EmptyState from '../../components/EmptyState/EmptyState';
import Pagination from '../../components/Pagination/Pagination';
import GlobalLoader from '../../components/Loader/GlobalLoader';
import Table from '../../components/Table/Table';
import PageTitle from '../../components/PageTitle/PageTitle';
import { deleteCoupon, getAllCoupons, } from '../../services/couponServices';
import '../Product/product.css';

const Coupon = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [couponData, setCouponData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [error] = useState(null);
    
    const fetchAllCoupns = async () => {
        setLoading(true);
        const resp = await getAllCoupons(page, itemsPerPage, searchTerm);
        if (resp && resp.data) {
            setCouponData(resp.data);
            if (resp.pagination) {
                setTotalItems(resp.pagination.total || resp.data.length);
                setTotalPages(resp.pagination.pages || 1);
            } else {
                setTotalItems(resp.data.length);
                setTotalPages(1);
            }
        } else {
            setCouponData([]);
            setTotalItems(0);
            setTotalPages(1);
            if (resp && resp.error) toast.error(resp.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAllCoupns();
    }, [page, itemsPerPage, searchTerm]);

    const filteredGiftCards = couponData;

    // Edit gift card
    const handleEdit = useCallback((id, e) => {
        e.stopPropagation();
        navigate(`/coupon/edit/${id}`);
    }, [navigate]);

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        itemId: null,
        itemName: ''
    });

    // Delete gift card
    const handleDelete = useCallback((id:string, e) => {
        e.stopPropagation();
        const item = couponData.find(item => item._id === id);
        setConfirmDialog({
            isOpen: true,
            itemId: id,
            itemName: item?.code || 'this gift card'
        });
    }, [couponData]);


    const confirmDelete = useCallback(async () => {
        if (!confirmDialog.itemId) return;
        const token = sessionStorage.getItem('authToken')?.replace(/^"|"$/g, '');
        try {
            const resp = await deleteCoupon(confirmDialog.itemId, token);
            if (resp && resp.success === false) {
                throw new Error(resp.error || 'Delete failed');
            }
            toast.success('Coupon deleted successfully!');
            setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
            fetchAllCoupns(); // Refresh list
        } catch (err) {
            toast.error('Failed to delete Coupon');
            setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
        }
    }, [confirmDialog.itemId]);


    const closeConfirmDialog = useCallback(() => {
        setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    }, []);

    return (
        <DashboardLayout>
            <div className="news-page">
                <PageTitle
                    title="Coupon"
                    subTitle="Manage your Coupon inventory."
                    button={true}
                    buttonLabel="Add Coupon"
                    onButtonClick={() => navigate('/coupon/edit/new')}
                />

                <div className="search-bar">
                    <SearchAndFilter
                        searchValue={searchTerm}
                        onSearchChange={value => {
                            setSearchTerm(value);
                            setPage(1);
                        }}
                        showFilter={false}
                        placeholder="Search coupon code..."
                    />
                </div>
                <div className="product-table-wrapper order-list__table-container">
                    {loading ? (
                        <GlobalLoader text="Loading Coupons..." />
                    ) : error ? (
                        <div className="empty-state" > {error}</div>
                    ) : filteredGiftCards.length > 0 ? (
                        <Table
                            tableClassName="product-table"
                            columns={[
                                { key: 'code', label: 'Coupon Code', },
                                { key: 'discountType', label: 'Coupon type' },
                                { key: 'discountValue', label: 'Coupon Amount' },
                                {
                                    key: 'products',
                                    label: 'Products',
                                    render: (products) => {
                                        if (!products || products.length === 0) return '-';
                                        const displayProducts = products.slice(0, 3);
                                        return (
                                            <div>
                                                {displayProducts.map((p, index) => (
                                                    <div key={p._id || index}>{p.productName || p._id}</div>
                                                ))}
                                                {products.length > 3 && <div>...</div>} 
                                            </div>
                                        );
                                    }
                                },
                                { key: 'expiryDate', label: 'Expiry date', render: value => value ? dayjs(value).format('DD-MMM-YYYY') : '' },
                                {
                                    key: 'actions',
                                    label: 'Actions',
                                    render: (value, item) => (
                                        <>
                                            <Button className="btn-icon edit" onClick={e => handleEdit(item._id, e)} title={`Edit ${item.name}`} aria-label={`Edit ${item.name}`} variant="icon">
                                                <EditIcon />
                                            </Button>
                                            <Button className="btn-icon delete" onClick={e => handleDelete(item._id || item.id, e)} title={`Delete ${item.productName || item.name}`} aria-label={`Delete ${item.productName || item.name}`} variant="danger">
                                                <DeleteIcon />
                                            </Button>
                                        </>
                                    )
                                }
                            ]}
                            data={filteredGiftCards}
                        />
                    ) : (
                        <EmptyState
                            icon={<CardGiftcardIcon style={{ fontSize: 48 }} />}
                            title="No Gift Cards Found"
                            description={searchTerm ? 'No gift cards found' : 'No gift cards yet'}
                        />
                    )}
                </div>
                {totalPages > 1 && !loading && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        showInfo={true}
                        showJumper={totalPages > 10}
                    />
                )}
                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    onClose={closeConfirmDialog}
                    onConfirm={confirmDelete}
                    title="Delete Gift Card"
                    message={`Are you sure you want to delete "${confirmDialog.itemName}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    type="danger"
                />
            </div>
        </DashboardLayout >
    );
};

export default Coupon;
