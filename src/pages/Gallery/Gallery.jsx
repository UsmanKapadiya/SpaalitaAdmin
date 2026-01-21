import Button from '../../components/Button/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import GlobalLoader from '../../components/Loader/GlobalLoader';
import ArticleIcon from '@mui/icons-material/Article';
import CollectionsIcon from '@mui/icons-material/Collections';
import EmptyState from '../../components/EmptyState/EmptyState';
import Card from '../../components/Card/Card';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import mockGallery from '../../data/mockGallery';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);
        setImages(mockGallery.map(item => ({
            id: item.id,
            image: item.image,
            created_at: item.created_at
        })).filter(item => !!item.image));
        setLoading(false);
    }, []);

    const handleEdit = (id) => {
        navigate(`/gallery/edit/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            setImages(prev => prev.filter(img => img.id !== id));
        }
    };

    const filteredImages = useMemo(() => {
        if (!searchTerm.trim()) return images;
        const search = searchTerm.toLowerCase();
        return images.filter(item =>
            (item.created_at && item.created_at.toLowerCase().includes(search))
            || (item.id && item.id.toLowerCase().includes(search))
        );
    }, [searchTerm, images]);

    return (
        <DashboardLayout>
            <div className="news-page">

                <div className="news-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Gallery</h1>
                        <p className="page-subtitle">Browse all uploaded images</p>
                    </div>
                    <div className="news-actions">
                        <Button className="btn-add" type="button" onClick={() => navigate('/gallery/edit/new')}>
                            <AddIcon />
                            Add Gallery
                        </Button>
                    </div>
                </div>

                <SearchAndFilter
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search by date or id..."
                    showFilter={false}

                />

                <div className="gallery-grid news-list order-list__table-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                    {loading && <GlobalLoader text="Loading..." />}
                    {error ? (
                        <div className="empty-state">{error}</div>
                    ) : filteredImages.length > 0 ? (
                        filteredImages.map((item, idx) => (
                            <Card className="news-item-wrapper" key={item.id} style={{ margin: 10, cursor: 'default', position: 'relative', padding: 16 }}>
                                <div className='news-item'>
                                    <div className="news-item-header" style={{ marginBottom: 8 }}>
                                        <div className="news-item-info">
                                            <div className="news-item-title">{item.created_at}</div>
                                        </div>
                                        <div className="news-item-actions" style={{ display: 'flex', gap: 8 }}>
                                            <Button className="btn-icon edit" type="button" title="Edit" aria-label={`Edit image ${item.id}`} onClick={() => handleEdit(item.id)}>
                                                <EditIcon fontSize="small" />
                                            </Button>
                                            <Button className="btn-icon delete" type="button" title="Delete" aria-label={`Delete image ${item.id}`} onClick={() => handleDelete(item.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="news-item-description">
                                        <div className="gallery-img-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
                                            <img src={item.image} alt={`Gallery ${item.id}`} className="gallery-img" style={{ maxHeight: 160, borderRadius: 6 }} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <EmptyState
                            icon={<CollectionsIcon style={{ fontSize: 48 }} />}
                            title="No Images Found"
                            description={searchTerm ? 'No images found' : 'No images yet'}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Gallery;
