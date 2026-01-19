


import mockMonthlySpecials from '../../data/mockMonthlySpecials';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import { toast } from 'react-toastify';
import '../GiftCard/EditGiftCard.css';

const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthlySpecialForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id && id !== 'new');
    const monthName = isEdit ? id.charAt(0).toUpperCase() + id.slice(1) : '';
    const currentSpecial = isEdit ? mockMonthlySpecials.find(s => s.month.toLowerCase() === id?.toLowerCase()) : null;

    const [selectedMonth, setSelectedMonth] = useState(isEdit ? monthName : '');
    const [image, setImage] = useState(currentSpecial?.image || '');
    const [imagePreview, setImagePreview] = useState('');
    const previousImage = currentSpecial?.image || '';
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


    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        setError('');
        setSuccess('');
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        if (!selectedMonth) {
            setError('Please select a month.');
            setLoading(false);
            return;
        }
        if (!image) {
            setError('Please select an image.');
            setLoading(false);
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            let updated;
            if (isEdit) {
                updated = mockMonthlySpecials.map(s =>
                    s.month.toLowerCase() === month?.toLowerCase()
                        ? { ...s, image: reader.result }
                        : s
                );
            } else {
                // Add new special
                updated = [
                    ...mockMonthlySpecials,
                    { id: String(mockMonthlySpecials.length + 1), month: selectedMonth, image: reader.result }
                ];
            }
            localStorage.setItem('monthlySpecials', JSON.stringify(updated));
            setLoading(false);
            setSuccess(isEdit ? 'Monthly Special updated!' : 'Monthly Special added!');
            setTimeout(() => navigate('/monthly-special'), 1200);
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
                    <div className="edit-form-header">
                        <h1 className="edit-form-title">
                            {isEdit ? 'Update Monthly Special' : 'Add Monthly Special'}
                        </h1>
                        <p className="edit-form-subtitle">
                            {isEdit ? 'Edit monthly special image and save changes.' : 'Fill in the details to add a new monthly special.'}
                        </p>
                    </div>

                    {error && <div className="error-banner">{error}</div>}
                    {success && <div className="success-banner">{success}</div>}

                    <form onSubmit={handleSubmit} className="edit-form" autoComplete="off">
                        <div className="form-row">
                            <div className="form-group form-group-full">
                                <label className="form-label form-label-required">Month</label>
                                {isEdit ? (
                                    <input type="text" value={monthName} disabled className="form-input" />
                                ) : (
                                    <select value={selectedMonth} onChange={handleMonthChange} required className="form-input">
                                        <option value="">Select Month</option>
                                        {monthOptions.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
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

export default MonthlySpecialForm;
