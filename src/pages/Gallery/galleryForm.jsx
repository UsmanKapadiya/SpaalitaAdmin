import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { toast } from 'react-toastify';
import PageTitle from '../../components/PageTitle/PageTitle';
import { createGallery, updateGallery } from '../../services/galleryServices';

const GalleryForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const isEdit = Boolean(id && id !== 'new');
    const [images, setImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isEdit) {
            const data = location?.state;
            if (data?.url) {
                setImagePreview([data.url]);
                setImages([]);
            }
        }
    }, [id, isEdit]);

    useEffect(() => {
        return () => {
            imagePreview.forEach((preview) => URL.revokeObjectURL(preview)); // Revoke object URLs
        };
    }, [imagePreview]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        const validFiles = files.filter((file) => {
            if (!allowedTypes.includes(file.type)) {
                toast.error(`Invalid file type: ${file.name}`);
                return false;
            }

            if (file.size > maxSize) {
                toast.error(`File too large: ${file.name}`);
                return false;
            }

            return true;
        });

        if (validFiles.length > 0) {
            if (isEdit) {
                setImages([validFiles[0]]);
                setImagePreview([URL.createObjectURL(validFiles[0])]);
            } else {
                setImages((prevImages) => [...prevImages, ...validFiles]);
                const previews = validFiles.map((file) => URL.createObjectURL(file));
                setImagePreview((prevPreviews) => [...prevPreviews, ...previews]);
            }
        }
    };


    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        const updatedPreviews = imagePreview.filter((_, i) => i !== index);
        setImages(updatedImages);
        setImagePreview(updatedPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEdit && images.length === 0) {
            toast.error('Please select at least one image to upload.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = sessionStorage.getItem('authToken')?.replace(/^"|"$/g, '');
            if (!token) {
                toast.error('Authentication token is missing. Please log in again.');
                setLoading(false);
                return;
            }
            let response;
            const formData = new FormData();

            if (isEdit) {
                formData.append('image', images[0]);
                response = await updateGallery(id, formData, token);
            } else {
                images.forEach((file) => {
                    formData.append('images', file);
                });
                response = await createGallery(formData, token);
            }
            if (response && response.success) {
                setSuccess(isEdit ? 'Gallery updated successfully!' : 'Gallery created successfully');
                toast.success(isEdit ? 'Gallery updated successfully' : 'Gallery created successfully');
                setTimeout(() => navigate('/gallery'), 1200);
            } else {
                const errorMsg = response?.message
                    ? response.message
                    : (response?.error || 'Failed to save monthly special.');
                setError(errorMsg);
                toast.error(errorMsg);
            }


        } catch (err) {
            console.error('Error uploading images:', err);
            setError(err.message || 'Failed to upload images');
            toast.error(err.message || 'Failed to upload images');
        } finally {
            setLoading(false);
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
                        <div className="form-row">
                            <div className="form-group form-group-full">
                                <label className="form-label form-label-required">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple={!isEdit}
                                    onChange={handleImageChange}
                                    disabled={loading}
                                />
                                <p className="form-help-text">Upload a gallery image (jpg/png/gif). You can select multiple images.</p>

                                <div className="image-preview-container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {imagePreview.map((img, index) => {
                                        return (
                                            <div key={index} style={{ position: 'relative' }}>
                                                <img
                                                    src={img} // prepend backend URL if needed
                                                    alt={`preview-${index}`}
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        background: 'red',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '20px',
                                                        height: '20px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-add"
                                disabled={loading}
                            >
                                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Gallery' : 'Add Gallery')}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate('/monthly-special')}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default GalleryForm;
