import React, { useState, useMemo, useCallback, useEffect } from 'react';
import GlobalLoader from '../../components/Loader/GlobalLoader';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import dayjs from 'dayjs';
import ArticleIcon from '@mui/icons-material/Article';
import EmptyState from '../../components/EmptyState/EmptyState';
import Button from '../../components/Button/Button';
import Pagination from '../../components/Pagination/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import Table from '../../components/Table/Table';
import PageTitle from '../../components/PageTitle/PageTitle';
import { toast } from 'react-toastify';
import { getAllServices, deleteServices } from '../../services/services';

const Services = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [serviceData, setServiceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);


    const getAllService = async (pageNum = page, search = searchTerm) => {
        setLoading(true);
        setError(null);
        try {
            const resp = await getAllServices(pageNum, itemsPerPage, search);
            let services = [];
            if (resp && Array.isArray(resp.data)) {
                services = resp.data.map(item => ({
                    id: item._id || item.id,
                    name: item.serviceName,
                    image: item.serviceImage,
                    description: item.serviceDescription,
                    buttonUrl: item.buttonUrl,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }));
            }
            setServiceData(services);
            setTotalItems(resp.pagination?.total || services.length);
            setTotalPages(resp.pagination?.totalPages || 1);
            setLoading(false);
        } catch (err) {
            setError('Failed to load services.');
            setLoading(false);
        }
    };
    // Fetch all services from API on mount and when page/searchTerm changes
    useEffect(() => {
        getAllService(page, searchTerm);
    }, [page, searchTerm]);


    const handlePageChange = useCallback((event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Edit gift card
    const handleEdit = useCallback((id, e) => {
        console.log(id);
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

    const confirmDelete = useCallback(async () => {
        if (!confirmDialog.itemId) return;
        const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
        try {
            const response = await deleteServices(confirmDialog.itemId, token);
            if (response && response.success) {
                setServiceData(prev => prev.filter(item => item.id !== confirmDialog.itemId));
                toast.success('Service deleted successfully!');
            } else {
                toast.error(response?.error || 'Failed to delete service.');
            }
        } catch (err) {
            toast.error('An error occurred while deleting service.');
        } finally {
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
                    title="Services"
                    subTitle="Manage your Services inventory."
                    button={true}
                    buttonLabel="Add Service"
                    onButtonClick={() => navigate('/services/edit/new')}
                />
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
                    {loading ? (
                        <GlobalLoader text="Loading products..." />
                    ) : error ? (
                        <div className="empty-state">{error}</div>
                    ) : serviceData.length > 0 ? (
                        <Table
                            tableClassName="product-table"
                            columns={[
                                {
                                    key: 'image',
                                    label: 'Image',
                                    render: (value, item) => {
                                        let src = item.image || item.serviceImage;
                                        if (src && src.startsWith('data:image')) {
                                            // already valid base64
                                        } else if (src && !/^https?:\/\//.test(src) && !src.startsWith('/')) {
                                            src = `/uploads/${src}`;
                                        }
                                        return (
                                            <img src={src} alt={item.name || item.serviceName} style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover' }} />
                                        );
                                    },
                                },
                                { key: 'name', label: 'Name', render: (value, item) => value || item.serviceName },
                                {
                                    key: 'description',
                                    label: 'Description',
                                    render: (value) => {
                                        if (!value) return '';
                                        const plain = value.replace(/<[^>]+>/g, '');
                                        return plain.length > 40 ? plain.slice(0, 40) + '...' : plain;
                                    },
                                },
                                {
                                    key: 'createdAt',
                                    label: 'Created',
                                    render: value => value ? dayjs(value).format('DD-MMM-YYYY') : '',
                                },
                                {
                                    key: 'actions',
                                    label: 'Actions',
                                    render: (value, item) => (
                                        <>
                                            <Button className="btn-icon edit" onClick={e => handleEdit(item.id, e)} title={`Edit ${item.name}`} aria-label={`Edit ${item.name}`} variant="icon">
                                                <EditIcon />
                                            </Button>
                                            <Button className="btn-icon delete" onClick={e => handleDelete(item.id, e)} title={`Delete ${item.name}`} aria-label={`Delete ${item.name}`} variant="danger">
                                                <DeleteIcon />
                                            </Button>
                                        </>
                                    ),
                                },
                            ]}
                            data={serviceData}
                        />
                    ) : (
                        <EmptyState
                            icon={<ArticleIcon style={{ fontSize: 48 }} />}
                            title="No Services Found"
                            description={searchTerm ? 'No services found' : 'No services yet'}
                        />
                    )}

                </div>
                {totalPages > 1 && !loading && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => handlePageChange(null, newPage)}
                        showInfo={true}
                        showJumper={totalPages > 10}
                    />
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
