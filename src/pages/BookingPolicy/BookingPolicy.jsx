import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PolicyIcon from '@mui/icons-material/Policy';
import { toast } from 'react-toastify';
import EmptyState from '../../components/EmptyState/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Button from '../../components/Button/Button';
import dayjs from 'dayjs';
import Switch from '@mui/material/Switch';
import Card from '../../components/Card/Card';
import { deleteBookingPolicy, getAllBookingPolicy } from '../../services/bookingPolicyService';
import { updateBookingPolicy } from '../../services/bookingPolicyService';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import PageTitle from '../../components/PageTitle/PageTitle';
import GlobalLoader from '../../components/Loader/GlobalLoader';



const BookingPolicy = () => {
    const navigate = useNavigate();
    const [expandedItems, setExpandedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toggleDialog, setToggleDialog] = useState({ isOpen: false, policyId: null });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        itemId: null,
        itemName: '',
    });
    
    async function fetchPolicies() {
        try {
            const resp = await getAllBookingPolicy(page, 10, searchTerm);
            if (resp && resp.success && Array.isArray(resp.data)) {
                setPolicies(resp.data);
                setError(null);
            } else {
                setPolicies([]);
                setError(resp?.error || 'Failed to fetch booking policies');
            }
        } catch (err) {
            setPolicies([]);
            setError('Failed to fetch booking policies');
        }
        setLoading(false);
    }
    useEffect(() => {
        setLoading(true);
        fetchPolicies();
    }, [page, searchTerm]);


    const filteredPolicies = useMemo(() => {
        if (!searchTerm.trim()) return policies;
        const search = searchTerm.toLowerCase();
        return policies.filter(item =>
            item.title.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            (item.date && item.date.toLowerCase().includes(search))
        );
    }, [searchTerm, policies]);

    const updatePolicyStatus = async (selectedId) => {
        const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
        const selectedPolicy = policies.find(item => item._id === selectedId);
        if (selectedPolicy && selectedPolicy.status !== 'active') {
            const resp = await updateBookingPolicy(selectedId, token, { ...selectedPolicy, status: 'active' });
            if (resp && resp.success) {
                toast.success(`Policy "${selectedPolicy.title}" set to active.`);
            } else {
                toast.error(resp?.error || `Failed to update policy "${selectedPolicy.title}"`);
            }
        }
    };

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
        const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
        try {
            const response = await deleteBookingPolicy(confirmDialog.itemId, token);
            if (response && response.success) {
                fetchPolicies();
                //setPolicies(prev => prev.filter(item => item.id !== confirmDialog.itemId));
                toast.success('BookingPolicy deleted successfully!');
            } else {
                toast.error(response?.error || 'Failed to delete BookingPolicy.');
            }
        } catch (err) {
            toast.error('An error occurred while deleting BookingPolicy.');
        } finally {
            setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
        }
    }, [confirmDialog.itemId]);

    const closeConfirmDialog = useCallback(() => {
        setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    }, []);

    const handleToggleActive = useCallback((id) => {
        setToggleDialog({ isOpen: true, policyId: id });
    }, []);

    const confirmToggleActive = useCallback(() => {
        const selectedId = toggleDialog.policyId;
        updatePolicyStatus(selectedId).then(() => {
            setPolicies(prev => prev.map(item => ({ ...item, status: item._id === selectedId ? 'active' : 'inactive' })));
            setToggleDialog({ isOpen: false, policyId: null });
        });
    }, [toggleDialog.policyId, policies]);

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
                                checked={item.status === 'active'}
                                onClick={e => e.stopPropagation()}
                                onChange={() => handleToggleActive(item._id)}
                                color="primary"
                                inputProps={{ 'aria-label': 'Status Policy Toggle' }}
                            />
                            <span style={{ fontSize: 12, color: item.status === 'active' ? '#388e3c' : '#888' }}>{item.status === 'active' ? 'Active' : 'Inactive'}</span>
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
