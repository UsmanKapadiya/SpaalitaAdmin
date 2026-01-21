import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import PolicyIcon from '@mui/icons-material/Policy';

import EmptyState from '../../components/EmptyState/EmptyState';
import Pagination from '../../components/Pagination/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Button from '../../components/Button/Button';
import dayjs from 'dayjs';
import Switch from '@mui/material/Switch';
import Card from '../../components/Card/Card';
import { mockBookingPolicies } from '../../data/mockBookingPolicies';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import PageTitle from '../../components/PageTitle/PageTitle';
import GlobalLoader from '../../components/Loader/GlobalLoader';



const BookingPolicy = () => {
    const navigate = useNavigate();
    const [expandedItems, setExpandedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        itemId: null,
        itemName: '',
    });
    const [policies, setPolicies] = useState(mockBookingPolicies);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toggleDialog, setToggleDialog] = useState({ isOpen: false, policyId: null });

    useEffect(() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 600);
    }, []);
    // Memoized filtered and sorted data (client-side search only)
    const filteredPolicies = useMemo(() => {
        if (!searchTerm.trim()) return policies;
        const search = searchTerm.toLowerCase();
        return policies.filter(item =>
            item.title.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            (item.date && item.date.toLowerCase().includes(search))
        );
    }, [searchTerm, policies]);

    // Reset to page 1 when search changes
    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const toggleExpand = useCallback((id) => {
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, []);

    const handleEdit = useCallback((id, e) => {
        e.stopPropagation();
        navigate(`/bookingPolicy/edit/${id}`);
    }, [navigate]);

    const handleDelete = useCallback((id, e) => {
        e.stopPropagation();
        const item = policies.find(item => item.id === id);
        setConfirmDialog({
            isOpen: true,
            itemId: id,
            itemName: item?.title || 'this policy'
        });
    }, [policies]);

    const confirmDelete = useCallback(async () => {
        if (!confirmDialog.itemId) return;
        setLoading(true);
        setPolicies(prev => prev.filter(item => item._id !== confirmDialog.itemId));
        setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
        setLoading(false);
    }, [confirmDialog.itemId]);

    const closeConfirmDialog = useCallback(() => {
        setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    }, []);

    const handleToggleActive = useCallback((id) => {
        setToggleDialog({ isOpen: true, policyId: id });
    }, []);

    const confirmToggleActive = useCallback(() => {
        setPolicies(prev => prev.map(item => ({ ...item, active: item._id === toggleDialog.policyId })));
        setToggleDialog({ isOpen: false, policyId: null });
    }, [toggleDialog.policyId]);

    const closeToggleDialog = useCallback(() => {
        setToggleDialog({ isOpen: false, policyId: null });
    }, []);

    const renderPolicyItem = useCallback((item) => {
        const isExpanded = expandedItems.includes(item._id);
        return (
            <Card className="news-item-wrapper" key={item._id} style={{ margin: 10 }} onClick={() => toggleExpand(item._id)}>
                <div className='news-item'>
                    <div className="news-item-header">
                        <div className="news-item-info">
                            <div className="news-item-title">{item.title}</div>
                            <div className="news-item-date">
                                <span className="date-badge">{dayjs(item.date).isValid() ? dayjs(item.date).format('DD-MMM-YYYY') : item.date}</span>
                                <span className={`date-badge`}>
                                    {item.updatedAt && dayjs(item.updatedAt).isValid()
                                        ? `Updated ${dayjs(item.updatedAt).fromNow()}`
                                        : item.createdAt && dayjs(item.createdAt).isValid()
                                            ? `Created ${dayjs(item.createdAt).fromNow()}`
                                            : ''}
                                </span>
                            </div>
                        </div>
                        <div className="news-item-actions" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Switch
                                checked={!!item.active}
                                onClick={e => e.stopPropagation()}
                                onChange={() => handleToggleActive(item._id)}
                                color="primary"
                                inputProps={{ 'aria-label': 'Active Policy Toggle' }}
                            />
                            <span style={{ fontSize: 12, color: item.active ? '#388e3c' : '#888' }}>{item.active ? 'Active' : 'Inactive'}</span>
                            <Button
                                type="button"
                                className="btn-icon edit"
                                onClick={(e) => handleEdit(item._id, e)}
                                title="Edit"
                                aria-label={`Edit ${item.title}`}
                            >
                                <EditIcon />
                            </Button>
                            <Button
                                type="button"
                                className="btn-icon delete"
                                onClick={(e) => handleDelete(item._id, e)}
                                title="Delete"
                                aria-label={`Delete ${item.title}`}
                            >
                                <DeleteIcon />
                            </Button>
                        </div>
                    </div>
                    {isExpanded && (
                        <div className="news-item-description">
                            <div dangerouslySetInnerHTML={{ __html: item.description }} />
                        </div>
                    )}
                </div>
            </Card>
        );
    }, [expandedItems, toggleExpand, handleEdit, handleDelete, handleToggleActive]);

    return (
        <DashboardLayout>
            <div className="news-page">
                <PageTitle
                    title="Booking Policy"
                    subTitle="Manage Booking Policy."
                    button={true}
                    buttonLabel="Add Booking Policy"
                    onButtonClick={() => navigate('/bookingPolicy/edit/new')}
                />
                <div className="search-bar">
                    <SearchAndFilter
                        searchValue={searchTerm}
                        onSearchChange={value => {
                            setSearchTerm(value);
                            setPage(1);
                        }}
                        showFilter={false}
                        placeholder="Search booking Policy by title, description, or date..."
                    />
                </div>

                <div className="news-list order-list__table-container">
                    {/* {loading && <GlobalLoader text="Loading..." />} */}
                    {loading ? (
                        <>
                            <GlobalLoader text="Loading Booking Policy..." />
                        </>
                    ) :
                        error ? (
                            <div className="empty-state">{error}</div>
                        ) : filteredPolicies.length > 0 ? (
                            filteredPolicies.map(renderPolicyItem)
                        ) : (
                            <EmptyState
                                icon={<PolicyIcon style={{ fontSize: 48 }} />}
                                title="No Policies Found"
                                description={searchTerm ? 'No policies found' : 'No policies yet'}
                            />
                        )}
                </div>

                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    onClose={closeConfirmDialog}
                    onConfirm={confirmDelete}
                    title="Delete BookingPolicy Item"
                    message={`Are you sure you want to delete "${confirmDialog.itemName}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    type="danger"
                />
                <ConfirmDialog
                    isOpen={toggleDialog.isOpen}
                    onClose={closeToggleDialog}
                    onConfirm={confirmToggleActive}
                    title="Set Active Policy"
                    message={"Are you sure you want to set this policy as active? Only one policy can be active at a time."}
                    confirmText="Yes, Set Active"
                    cancelText="Cancel"
                    type="info"
                />
            </div>
        </DashboardLayout>
    );
};

export default BookingPolicy;
