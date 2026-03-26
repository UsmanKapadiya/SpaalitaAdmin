import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import GlobalLoader from '../../components/Loader/GlobalLoader';
import CollectionsIcon from '@mui/icons-material/Collections';
import EmptyState from '../../components/EmptyState/EmptyState';
import Card from '../../components/Card/Card';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import mockGallery from '../../data/mockGallery';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import PageTitle from '../../components/PageTitle/PageTitle';
import { deleteGallery, getAllGallery } from '../../services/galleryServices';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import '../Gallery/gallery.css'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { toast } from 'react-toastify';
dayjs.extend(relativeTime);

const Gallery = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        itemId: null,
        itemName: ''
    });

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            getAllImages();
            setLoading(false);
        }, 600);
    }, [searchTerm]);

    const getAllImages = async (search = searchTerm) => {
        setLoading(true);
        setError(null);
        try {
            const resp = await getAllGallery(search);
            if (resp && Array.isArray(resp.data)) {
                setImages(resp?.data)
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to load services.');
            setLoading(false);
        }
    };

    const filteredImages = images;

    const handleEdit = (id, data) => {
        navigate(`/gallery/edit/${id}`, { state: data });
    };

    // Delete gift card
    const handleDelete = useCallback((id, e) => {
        e.stopPropagation();
        const item = images.find(item => item._id === id);
        // console.log(item);
        setConfirmDialog({
            isOpen: true,
            itemId: id,
            itemName: item?._id || 'this Image'
        });
    }, [images]);

    const confirmDelete = useCallback(async () => {
        if (!confirmDialog.itemId) return;
        const token = sessionStorage.getItem('authToken')?.replace(/^"|"$/g, '');
        try {
            const resp = await deleteGallery(confirmDialog.itemId, token);
            console.log(resp);
            if (resp && resp.success === false) {
                throw new Error(resp.error || 'Delete failed');
            }
            toast.success('Gallery deleted successfully!');
            setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
            getAllImages();
        } catch (err) {
            toast.error('Failed to delete Gallery');
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
                    title="Gallery"
                    subTitle="Browse all uploaded images."
                    button={true}
                    buttonLabel="Add Gallery"
                    onButtonClick={() => navigate('/gallery/edit/new')}
                />

                <SearchAndFilter
                    searchValue={searchTerm}
                    onSearchChange={value => {
                        setSearchTerm(value);
                    }}
                    placeholder="Search by date like 01-01-2026..."
                    showFilter={false}

                />

                <div className="gallery-grid news-list order-list__table-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                    {loading ? (
                        <GlobalLoader text="Loading gallery..." />
                    ) : error ? (
                        <div className="empty-state">{error}</div>
                    ) : filteredImages.length > 0 ? (
                        filteredImages.map((item) => {
                            return (
                                <Card className="news-item-wrapper" key={item._id} style={{ margin: 10, cursor: 'default', position: 'relative', padding: 16 }}>
                                    <div className='news-item'>
                                        <div className="news-item-header" style={{ marginBottom: 8 }}>
                                            <div className="news-item-info">
                                                <div className="news-item-title">{item.createdAt ? dayjs(item.createdAt).format('DD-MMM-YYYY') : ''}</div>
                                            </div>
                                            <div className="news-item-actions" style={{ display: 'flex', gap: 8 }}>
                                                <Button className="btn-icon edit" type="button" title="Edit" aria-label={`Edit image ${item._id}`} onClick={() => handleEdit(item._id, item)}>
                                                    <EditIcon fontSize="small" />
                                                </Button>
                                                <Button className="btn-icon delete" type="button" title="Delete" aria-label={`Delete image ${item._id}`} onClick={e => handleDelete(item._id || item.id, e)}>
                                                    <DeleteIcon fontSize="small" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="news-item-description">
                                            <div className="gallery-img-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
                                                <img src={item.url} alt={`Gallery ${item._id}`} className="gallery-img" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })
                    ) : (
                        <EmptyState
                            icon={<CollectionsIcon style={{ fontSize: 48 }} />}
                            title="No Images Found"
                            description={searchTerm ? 'No images found' : 'No images yet'}
                        />
                    )}
                </div>
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
        </DashboardLayout>
    );
};

export default Gallery;
