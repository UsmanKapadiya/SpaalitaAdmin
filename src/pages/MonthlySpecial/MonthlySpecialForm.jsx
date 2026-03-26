


// import mockMonthlySpecials from '../../data/mockMonthlySpecials';
import { createMonthlySpecial, getMonthlySpecilById, updateMonthlySpecial } from '../../services/monthlySpecialService';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import PageTitle from '../../components/PageTitle/PageTitle';
import '../GiftCard/EditGiftCard.css';

const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthlySpecialForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id && id !== 'new');
    // const monthName = isEdit ? id.charAt(0).toUpperCase() + id.slice(1) : '';
    // For real API, fetch currentSpecial by id if needed
    const [monthName, setMonthName] = useState('')
    const [selectedMonth, setSelectedMonth] = useState(isEdit ? monthName : '');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [previousImage, setPreviousImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        async function fetchMonthlySpecial() {
            if (isEdit && id) {
                setLoading(true);
                try {
                    const token = sessionStorage.getItem('authToken')?.replace(/^"|"$/g, '');
                    const resp = await getMonthlySpecilById(id, token);
                    if (resp && resp.success && resp.data) {
                        const data = resp.data;
                        setSelectedMonth(data.month);
                        setMonthName(data.month);
                        setImage(data?.image)
                        if (data.image) {
                            setImagePreview(data.image);
                        }
                    } else {
                        setError(resp?.error || 'Failed to fetch booking policy');
                    }
                } catch (err) {
                    setError('Failed to fetch booking policy');
                }
                setLoading(false);
            }
        }
        fetchMonthlySpecial();
    }, [id, isEdit]);

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
        reader.onloadend = async () => {
            const token = sessionStorage.getItem('authToken')?.replace(/^"|"$/g, '');
            const payload = {
                month: selectedMonth,
                image: reader.result,
            };
            let resp;
            if (isEdit) {
                resp = await updateMonthlySpecial(id, token, payload);
            } else {
                resp = await createMonthlySpecial(token, payload);
            }
            setLoading(false);
            if (resp && resp.success) {
                setSuccess(isEdit ? 'Monthly Special updated successfully' : 'Monthly special created successfully');
                toast.success(isEdit ? 'Monthly Special updated successfully' : 'Monthly special created successfully');
                setTimeout(() => navigate('/monthly-special'), 1200);
            } else {
                const errorMsg = resp?.message
                    ? resp.message
                    : (resp?.error || 'Failed to save monthly special.');
                setError(errorMsg);
                toast.error(errorMsg);
            }
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
                        title={isEdit ? 'Update Monthly Special' : 'Add Monthly Special'}
                        subTitle={isEdit ? 'Edit monthly special image and save changes.' : 'Fill in the details to add a new monthly special.'}
                        button={false}
                    />
                    {error && <div className="error-banner">{error}</div>}
                    {success && <div className="success-banner">{success}</div>}

                    <form onSubmit={handleSubmit} className="edit-form" autoComplete="off">
                        <div className="form-row">
                            <div className="form-group form-group-full">
                                <label className="form-label form-label-required">Month</label>
                                <select value={selectedMonth} onChange={handleMonthChange} required className="form-input">
                                    <option value="">Select Month</option>
                                    {monthOptions.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group form-group-full">
                                <label className="form-label form-label-required">Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="form-input file-input"
                                />
                                {imagePreview && (
                                    <div className="image-preview-wrapper">
                                        <img src={imagePreview} alt="Service Preview" className="image-preview" />
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
