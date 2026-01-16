
import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../GiftCard/EditGiftCard.css';
import { toast } from 'react-toastify';

const initialForm = {
    name: '',
    code: '',
    value: '',
    qty: '',
    description: '',
    image: '',
};

const ServicesForm = ({ services, setServices }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id && id !== 'new');
    const [form, setForm] = useState(initialForm);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (isEdit && services) {
            const service = services.find(g => g.id === id);
            if (service) {
                setForm({ ...service, value: String(service.value), qty: String(service.qty) });
                setImagePreview(service.image || '');
            }
        }
    }, [id, isEdit, services]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        setError('');
        setSuccess('');
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(f => ({ ...f, image: reader.result }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        setError('');
        setSuccess('');
    };

    const handleDescriptionChange = useCallback((value) => {
        setForm(f => ({ ...f, description: value }));
        setError('');
        setSuccess('');
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        if (!form.name || !form.code || !form.value || !form.qty || !form.description) {
            setError('Please fill all required fields');
            setLoading(false);
            return;
        }
        if (isEdit) {
            // setServices(prev => prev.map(g => g.id === id ? { ...form, id, value: parseFloat(form.value), qty: parseInt(form.qty) } : g));
            setSuccess('Service updated successfully!');
            toast.success('Service updated successfully!');
        } else {
            const newService = {
                ...form,
                id: Date.now().toString(),
                value: parseFloat(form.value),
                qty: parseInt(form.qty),
                createdAt: new Date().toISOString().slice(0, 10),
                updatedAt: new Date().toISOString().slice(0, 10),
            };
            // setServices(prev => [newService, ...prev]);
            setSuccess('Service added successfully!');
            toast.success('Service added successfully!');
        }
        setLoading(false);
        setTimeout(() => navigate('/services'), 1200);
    };

    return (
        <DashboardLayout>
            <div className="edit-product-page">
                <div className="edit-form-card">
                    <div className="edit-form-header">
                        <h1 className="edit-form-title">
                            {isEdit ? 'Update Service' : 'Add Service'}
                        </h1>
                        <p className="edit-form-subtitle">
                            {isEdit ? 'Edit service details and save changes.' : 'Fill in the details to add a new service.'}
                        </p>
                    </div>

                    {error && <div className="error-banner">{error}</div>}
                    {success && <div className="success-banner">{success}</div>}

                    <form onSubmit={handleSubmit} className="edit-form" autoComplete="off">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label form-label-required">Service Name</label>
                                <select
                                    id="name"
                                    name="name"
                                    className="form-input"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a service</option>
                                    <option value="Facials">Facials</option>
                                    <option value="Massages">Massages</option>
                                    <option value="Acupressure">Acupressure</option>
                                    <option value="Manicures and Pedicures">Manicures and Pedicures</option>
                                    <option value="Body Treatments">Body Treatments</option>
                                    <option value="Waxing">Waxing</option>
                                    <option value="Laser Hair Removal">Laser Hair Removal</option>
                                    <option value="Brows and Lashes">Brows and Lashes</option>
                                    <option value="Spa Packages">Spa Packages</option>
                                </select>
                            </div>                    
                        </div>                    
                        <div className="form-row">
                            <div className="form-group form-group-full">
                                <label htmlFor="image" className="form-label">Service Image</label>
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
                                <p className="form-help-text">Upload a service image (optional, jpg/png/gif)</p>
                            </div>
                        </div>
                        <div className="form-group form-group-full">
                            <label htmlFor="description" className="form-label form-label-required">Service Description</label>
                            <div className="editor-wrapper">
                                <ReactQuill
                                    theme="snow"
                                    value={form.description || ''}
                                    onChange={handleDescriptionChange}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'color': [] }, { 'background': [] }],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            [{ 'align': [] }],
                                            ['link', 'image'],
                                            ['blockquote', 'code-block'],
                                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                                            ['clean']
                                        ]
                                    }}
                                    formats={[
                                        'header',
                                        'bold', 'italic', 'underline', 'strike',
                                        'color', 'background',
                                        'list', 'bullet',
                                        'align',
                                        'link', 'image',
                                        'blockquote', 'code-block',
                                        'indent'
                                    ]}
                                    style={{ height: '180px' }}
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <Button
                                type="submit"
                                className="btn-add"
                                disabled={loading}
                            >
                                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Service' : 'Add Service')}
                            </Button>
                            <Button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate('/services')}
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

export default ServicesForm;
// This file is now obsolete. All Gift Card add/edit logic is in GiftCard.jsx.
