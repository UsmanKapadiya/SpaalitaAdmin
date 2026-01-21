

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EmptyState from '../../components/EmptyState/EmptyState';
import Pagination from '../../components/Pagination/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Button from '../../components/Button/Button';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import GlobalLoader from '../../components/Loader/GlobalLoader';
import Card from '../../components/Card/Card';
import mockMonthlySpecials from '../../data/mockMonthlySpecials';
import PageTitle from '../../components/PageTitle/PageTitle';

const MonthlySpecial = () => {
    const navigate = useNavigate();
    const [expandedItems, setExpandedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        itemId: null,
        itemName: '',
    });
    const [specials, setSpecials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setSpecials(mockMonthlySpecials);
            setLoading(false);
        }, 600);
    }, []);

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
            <Card className="news-item-wrapper" key={item.id} style={{ margin: 10 }} onClick={() => toggleExpand(item.id)}>
                <div className='news-item'>
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
            </Card>
        );
    }, [expandedItems, toggleExpand, handleEdit, handleDelete]);

    return (
        <DashboardLayout>
            <div className="news-page">
                <PageTitle
                    title="Monthly Special"
                    subTitle="Manage Monthly Special offers."
                    button={true}
                    buttonLabel="Add Monthly Special"
                    onButtonClick={() => navigate('/monthly-special/edit/new')}
                />
                <div className="search-bar">
                    <SearchAndFilter
                        searchValue={searchTerm}
                        onSearchChange={value => {
                            setSearchTerm(value);
                            setPage(1);
                        }}
                        showFilter={false}
                        placeholder="Search monthly specials by month..."
                    />
                </div>

                <div className="news-list order-list__table-container">
                    {loading ? (
                        <GlobalLoader text="Loading monthly specials..." />
                    ) : (
                        error ? (
                            <div className="empty-state">{error}</div>
                        ) : filteredSpecials.length > 0 ? (
                            filteredSpecials.map(renderSpecialItem)
                        ) : (
                            <EmptyState
                                icon={<EventNoteIcon style={{ fontSize: 48 }} />}
                                title="No Monthly Specials Item Found"
                                description={searchTerm ? 'No Monthly Specials Item found' : 'No monthly specials yet'}
                            />
                        ))}
                </div>
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
