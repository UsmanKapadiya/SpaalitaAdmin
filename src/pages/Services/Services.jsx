import React, { useState, useMemo, useCallback } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import dayjs from 'dayjs';
import ArticleIcon from '@mui/icons-material/Article';
import Button from '../../components/Button/Button';
import Pagination from '../../components/Pagination/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';

const Services = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 2;
    const [loading] = useState(false);
    const [error] = useState(null);

    const allServices = [
        {
            id: '1',
            name: 'FACIALS',
            description: 'Professional web design services for businesses and individuals.',
            thumbnail: 'https://spaalita.ca/wp-content/uploads/2021/06/ezgif.com-gif-maker.jpg',
            createdAt: '2025-12-01',
            updatedAt: '2026-01-10',
        },
        {
            id: '2',
            name: 'SEO Optimization',
            description: 'Improve your website ranking with our SEO optimization service.',
            thumbnail: 'https://via.placeholder.com/80x80?text=SEO',
            createdAt: '2025-11-15',
            updatedAt: '2025-12-20',
        },
        {
            id: '3',
            name: 'Content Writing',
            description: 'High-quality content writing for blogs, websites, and more.',
            thumbnail: 'https://via.placeholder.com/80x80?text=Content',
            createdAt: '2025-10-10',
            updatedAt: '2025-11-01',
        },
        {
            id: '4',
            name: 'Digital Marketing',
            description: 'Comprehensive digital marketing solutions for your brand.',
            thumbnail: 'https://via.placeholder.com/80x80?text=Marketing',
            createdAt: '2025-09-05',
            updatedAt: '2025-10-01',
        },
        {
            id: '5',
            name: 'App Development',
            description: 'Custom mobile and web app development services.',
            thumbnail: 'https://via.placeholder.com/80x80?text=App',
            createdAt: '2025-08-01',
            updatedAt: '2025-09-01',
        },
    ];
    const [serviceData, setServiceData] = useState(allServices);

    // Filter and paginate gift cards
    const filteredServices = useMemo(() => {
        let filtered = serviceData;
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            filtered = serviceData.filter(item =>
                item.name.toLowerCase().includes(search) ||
                item.code?.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search)
            );
        }
        const startIdx = (page - 1) * itemsPerPage;
        return filtered.slice(startIdx, startIdx + itemsPerPage);
    }, [searchTerm, serviceData, page]);

    const totalItems = useMemo(() => {
        if (!searchTerm.trim()) return serviceData.length;
        const search = searchTerm.toLowerCase();
        return serviceData.filter(item =>
            item.name.toLowerCase().includes(search) ||
            item.code?.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search)
        ).length;
    }, [searchTerm, serviceData]);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Reset to page 1 when search changes
    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Edit gift card
    const handleEdit = useCallback((id, e) => {
        e.stopPropagation();
        navigate(`/services/edit/${id}`);
    }, [navigate]);

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        itemId: null,
        itemName: ''
    });

    // Delete gift card
    const handleDelete = useCallback((id, e) => {
        e.stopPropagation();
        const item = serviceData.find(item => item.id === id);
        setConfirmDialog({
            isOpen: true,
            itemId: id,
            itemName: item?.name || 'this service'
        });
    }, [serviceData]);

    const confirmDelete = useCallback(() => {
        if (!confirmDialog.itemId) return;
        setServiceData(prev => prev.filter(item => item.id !== confirmDialog.itemId));
        setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
        toast.success('Service deleted successfully!');
    }, [confirmDialog.itemId]);

    const closeConfirmDialog = useCallback(() => {
        setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    }, []);

    return (
        <DashboardLayout>
            <div className="product-page">
                <div className="page-header">
                    <div className="product-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1 className="page-title">Services</h1>
                            <p className="page-subtitle">Manage your Services inventory</p>
                        </div>
                        <div className="product-actions" style={{ marginLeft: 'auto' }}>
                            <Button className="btn-add" onClick={() => navigate('/services/edit/new')} variant="primary">
                                <AddIcon />
                                Add Service
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="search-bar">
                    <SearchAndFilter
                        searchValue={searchTerm}
                        onSearchChange={value => {
                            setSearchTerm(value);
                            setPage(1);
                        }}
                        showFilter={false}
                        placeholder="Search services by name, code, or description..."
                    />
                </div>

                <div className="product-table-wrapper">
                    {loading && <GlobalLoader text="Loading..." />}
                    {error ? (
                        <div className="empty-state">{error}</div>
                    ) : filteredServices.length > 0 ? (
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <img src={item.thumbnail} alt={item.name} style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover' }} />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.description && item.description.length > 40 ? item.description.slice(0, 40) + '...' : item.description}</td>
                                        <td>{item.createdAt ? dayjs(item.createdAt).format('DD-MMM-YYYY') : ''}</td>
                                        {/* <td>{item.updatedAt ? dayjs(item.updatedAt).format('DD-MMM-YYYY') : ''}</td> */}
                                        <td>
                                            <Button className="btn-icon edit" onClick={e => handleEdit(item.id, e)} title="Edit" aria-label={`Edit ${item.name}`} variant="icon">
                                                <EditIcon />
                                            </Button>
                                            <Button className="btn-icon delete" onClick={e => handleDelete(item.id, e)} title="Delete" aria-label={`Delete ${item.name}`} variant="danger">
                                                <DeleteIcon />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon"><ArticleIcon style={{ fontSize: 48 }} /></div>
                            <div className="empty-state-text">
                                {searchTerm ? 'No services found' : 'No services yet'}
                            </div>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    // <div className="pagination-container">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => handlePageChange(null, newPage)}
                            showInfo={true}
                            showJumper={totalPages > 10}
                        />
                    // </div>
                )}

                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    onClose={closeConfirmDialog}
                    onConfirm={confirmDelete}
                    title="Delete Service"
                    message={`Are you sure you want to delete "${confirmDialog.itemName}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    type="danger"
                />
            </div>
        </DashboardLayout>
    );
};

export default Services;
