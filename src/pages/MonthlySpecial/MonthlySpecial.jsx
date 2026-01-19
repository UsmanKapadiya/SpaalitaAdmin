

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
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import GlobalLoader from '../../components/Loader/GlobalLoader';
import mockMonthlySpecials from '../../data/mockMonthlySpecials';

const MonthlySpecial = () => {
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
    const [specials, setSpecials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const fetchSpecials = async () => {
            setLoading(true);
            setError(null);
            setSpecials(mockMonthlySpecials);
            setTotalPages(1);
            setTotalItems(mockMonthlySpecials.length);
            setLoading(false);
        };
        fetchSpecials();
    }, [page, itemsPerPage]);

    // Memoized filtered and sorted data (client-side search only)
    const filteredSpecials = useMemo(() => {
        if (!searchTerm.trim()) return specials;
        const search = searchTerm.toLowerCase();
        return specials.filter(item =>
            item.month.toLowerCase().includes(search)
        );
    }, [searchTerm, specials]);

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
        navigate(`/monthly-special/edit/${id}`);
    }, [navigate]);

    const handleDelete = useCallback((id, e) => {
        e.stopPropagation();
        const item = specials.find(item => item.id === id);
        setConfirmDialog({
            isOpen: true,
            itemId: id,
            itemName: item?.month || 'this special',
        });
    }, [specials]);

    const confirmDelete = useCallback(async () => {
        if (!confirmDialog.itemId) return;
        setLoading(true);
        setSpecials(prev => prev.filter(item => item.id !== confirmDialog.itemId));
        setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
        setLoading(false);
    }, [confirmDialog.itemId]);

    const closeConfirmDialog = useCallback(() => {
        setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    }, []);

    const renderSpecialItem = useCallback((item) => {
        const isExpanded = expandedItems.includes(item.id);
        return (
            <div className="news-item-wrapper" key={item.id}>
                <div
                    className="news-item"
                    onClick={() => toggleExpand(item.id)}
                >
                    <div className="news-item-header">
                        <div className="news-item-info">
                            <div className="news-item-title">{item.month}</div>
                            <div className="news-item-date">
                                                                {/* Show small image and created_at date */}
                                                                {item.image && (
                                                                    <img src={item.image} alt={item.month} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, marginRight: 8, border: '1px solid #eee' }} />
                                                                )}
                                                                <span className="date-badge">{item.created_at ? dayjs(item.created_at).format('DD-MMM-YYYY') : ''}</span>
                            </div>
                        </div>
                        <div className="news-item-actions" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Button
                                type="button"
                                className="btn-icon edit"
                                onClick={(e) => handleEdit(item.id, e)}
                                title="Edit"
                                aria-label={`Edit ${item.month}`}
                            >
                                <EditIcon />
                            </Button>
                            <Button
                                type="button"
                                className="btn-icon delete"
                                onClick={(e) => handleDelete(item.id, e)}
                                title="Delete"
                                aria-label={`Delete ${item.month}`}
                            >
                                <DeleteIcon />
                            </Button>
                        </div>
                    </div>
                    {isExpanded && (
                        <div className="news-item-description">
                            <div className="monthly-special-image">
                                {item.image ? (
                                    <img src={item.image} alt={item.month} />
                                ) : (
                                    <span>No image</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }, [expandedItems, toggleExpand, handleEdit, handleDelete]);

    return (
        <DashboardLayout>
            <div className="news-page">
                <div className="news-header">
                    <div>
                        <h1 className="page-title">Monthly Specials</h1>
                        <p className="page-subtitle">Manage monthly special offers</p>
                    </div>
                    <div className="news-actions">
                        <Button className="btn-add" type="button" onClick={() => navigate('/monthly-special/edit/new')}>
                            <AddIcon />
                            Add Monthly Special
                        </Button>
                    </div>
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search monthly special by month..."
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
                </div>

                <div className="news-list">
                    {loading && <GlobalLoader text="Loading..." />}
                    {error ? (
                        <div className="empty-state">{error}</div>
                    ) : filteredSpecials.length > 0 ? (
                        filteredSpecials.map(item => (
                            <div key={item.id}>{renderSpecialItem(item)}</div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon"><ArticleIcon style={{ fontSize: 48 }} /></div>
                            <div className="empty-state-text">
                                {searchTerm ? 'No specials found' : 'No monthly specials yet'}
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
                    title="Delete Monthly Special"
                    message={`Are you sure you want to delete "${confirmDialog.itemName}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    type="danger"
                />
            </div>
        </DashboardLayout>
    );
};

export default MonthlySpecial;
