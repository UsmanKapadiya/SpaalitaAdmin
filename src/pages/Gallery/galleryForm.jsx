


import mockGallery from '../../data/mockGallery';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import { toast } from 'react-toastify';
import PageTitle from '../../components/PageTitle/PageTitle';



const GalleryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id && id !== 'new');
    const currentImage = isEdit ? mockGallery.find(s => s.id === id) : null;
    const [image, setImage] = useState(currentImage?.image || '');
    const [imagePreview, setImagePreview] = useState('');
    const previousImage = currentImage?.image || '';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setError('');
            setSuccess('');
        }
    };





    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        if (!image) {
            setError('Please select an image.');
            setLoading(false);
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            let updated;
            const galleryData = JSON.parse(localStorage.getItem('gallery') || 'null') || mockGallery;
            if (isEdit) {
                updated = galleryData.map(s =>
                    s.id === id
                        ? { ...s, image: reader.result, created_at: s.created_at }
                        : s
                );
            } else {
                // Add new image
                updated = [
                    ...galleryData,
                    { id: String(galleryData.length + 1), image: reader.result, created_at: new Date().toISOString().slice(0, 10) }
                ];
            }
            localStorage.setItem('gallery', JSON.stringify(updated));
            setLoading(false);
            setSuccess(isEdit ? 'Gallery image updated!' : 'Gallery image added!');
            setTimeout(() => navigate('/gallery'), 1200);
        };
        if (image && image instanceof File) {
            reader.readAsDataURL(image);
        } else {
            setLoading(false);
            setError('Please select an image.');
        }
    };

    return (
        <DashboardLayout>
            <div className="edit-product-page">
                <div className="edit-form-card">
                    <PageTitle
                        title={isEdit ? 'Update Gallery Image' : 'Add Gallery Image'}
                        subTitle={isEdit ? 'Edit gallery image and save changes.' : 'Fill in the details to add a new gallery image.'}
                        button={false}
                    />
                    {error && <div className="error-banner">{error}</div>}
                    {success && <div className="success-banner">{success}</div>}

                    <form onSubmit={handleSubmit} className="edit-form" autoComplete="off">
                        {/* No month selection for gallery images */}
                        <div className="form-row">
                            <div className="form-group form-group-full">
                                <label className="form-label form-label-required">Image</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="form-input file-input" />
                                {imagePreview && (
                                    <div className="image-preview-wrapper">
                                        <img src={imagePreview} alt="Preview" className="image-preview" />
                                    </div>
                                )}
                                {previousImage && !imagePreview && (
                                    <div className="image-preview-wrapper">
                                        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Previous Image:</span>
                                        <img src={previousImage} alt="Previous" className="image-preview" />
                                    </div>
                                )}
                                <p className="form-help-text">Upload a monthly special image (jpg/png/gif)</p>
                            </div>
                        </div>
                        <div className="form-actions">
                            <Button
                                type="submit"
                                className="btn-add"
                                disabled={loading}
                            >
                                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Monthly Special' : 'Add Monthly Special')}
                            </Button>
                            <Button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate('/monthly-special')}
                                disabled={loading}
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default GalleryForm;
