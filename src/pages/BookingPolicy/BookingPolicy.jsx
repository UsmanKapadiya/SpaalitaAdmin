import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import Pagination from '@mui/material/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Button from '../../components/Button/Button';
import dayjs from 'dayjs';
import Switch from '@mui/material/Switch';

const dummyNews = [
    {
        _id: '1',
        title: 'Grand Opening!',
        description: 'We are excited to announce the grand opening of our new spa location. Join us for exclusive offers and a relaxing experience.',
        date: '2026-01-10',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-10',
        active: true
    },
    {
        _id: '2',
        title: 'Grand Opening!',
        description: 'We are excited to announce the grand opening of our new spa location. Join us for exclusive offers and a relaxing experience.',
        date: '2026-01-10',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-10',
        active: false
    },
    {
        _id: '3',
        title: 'Grand Opening!',
        description: 'We are excited to announce the grand opening of our new spa location. Join us for exclusive offers and a relaxing experience.',
        date: '2026-01-10',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-10',
        active: false
    }]

const BookingPolicy = () => {
    const navigate = useNavigate();
    const [expandedItems, setExpandedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        itemId: null,
        itemName: '',
    });
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [toggleDialog, setToggleDialog] = useState({ isOpen: false, policyId: null });

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError(null);
            setNewsData(dummyNews);
            setTotalPages(1);
            setTotalItems(dummyNews.length);
            setLoading(false);
        };
        fetchNews();
    }, [page, itemsPerPage]);

    // Memoized filtered and sorted data (client-side search only)
    const filteredNews = useMemo(() => {
        if (!searchTerm.trim()) return newsData;
        const search = searchTerm.toLowerCase();
        return newsData.filter(item =>
            item.title.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            (item.date && item.date.toLowerCase().includes(search))
        );
    }, [searchTerm, newsData]);

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
        const item = newsData.find(item => item.id === id);
        setConfirmDialog({
            isOpen: true,
            itemId: id,
            itemName: item?.title || 'this news item'
        });
    }, [newsData]);

    const confirmDelete = useCallback(async () => {
        if (!confirmDialog.itemId) return;
        setLoading(true);
        const res = await deleteNews(confirmDialog.itemId);
        if (res.success) {
            // Refresh news list after delete
            const listRes = await getAllNews();
            if (listRes.success) {
                setNewsData(listRes.data?.data || []);
            }
            setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
            toast.success('BookingPolicy item deleted successfully!');
        } else {
            setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
            toast.error(res.error || 'Failed to delete news item');
        }
        setLoading(false);
    }, [confirmDialog.itemId]);

    const closeConfirmDialog = useCallback(() => {
        setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    }, []);

    const handleToggleActive = useCallback((id) => {
        setToggleDialog({ isOpen: true, policyId: id });
    }, []);

    const confirmToggleActive = useCallback(() => {
        setNewsData(prev => prev.map(item => ({ ...item, active: item._id === toggleDialog.policyId })));
        setToggleDialog({ isOpen: false, policyId: null });
    }, [toggleDialog.policyId]);

    const closeToggleDialog = useCallback(() => {
        setToggleDialog({ isOpen: false, policyId: null });
    }, []);

    const renderNewsItem = useCallback((item) => {
        const isExpanded = expandedItems.includes(item._id);
        return (
            <div className="news-item-wrapper" key={item._id}>
                <div
                    className="news-item"
                    onClick={() => toggleExpand(item._id)}
                >
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
            </div>
        );
    }, [expandedItems, toggleExpand, handleEdit, handleDelete, handleToggleActive]);

    return (
        <DashboardLayout>
            <div className="news-page">
                <div className="page-header">
                    <div className="news-header">
                        <div>
                            <h1 className="page-title">BookingPolicy</h1>
                            <p className="page-subtitle">Manage announcements and upcoming events</p>
                        </div>
                        <div className="news-actions">
                            <Button className="btn-add" type="button" onClick={() => navigate('/bookingPolicy/edit/new')}>
                                <AddIcon />
                                Add Booking Policy
                            </Button>
                        </div>
                    </div>
                </div>

                {/* <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search bookingPolicy by title, description, or date..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    {searchTerm && (
                        <Button
                            type="button"
                            className="clear-search"
                            onClick={() => {
                                setSearchTerm('');
                                setPage(1);
                            }}
                            aria-label="Clear search"
                        >
                            ×
                        </Button>
                    )}
                </div> */}

                <div className="news-list">
                    {/* {loading && <GlobalLoader text="Loading..." />} */}
                    {error ? (
                        <div className="empty-state">{error}</div>
                    ) : filteredNews.length > 0 ? (
                        filteredNews.map(item => (
                            <div key={item._id}>{renderNewsItem(item)}</div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon"><ArticleIcon style={{ fontSize: 48 }} /></div>
                            <div className="empty-state-text">
                                {searchTerm ? 'No news items found' : 'No news items yet'}
                            </div>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination-container">
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                        />
                    </div>
                )}

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
