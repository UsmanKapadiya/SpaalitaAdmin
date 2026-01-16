

import React from 'react';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../GiftCard/EditGiftCard.css';
import { toast } from 'react-toastify';
import useForm from '../../hooks/useForm';
import mockServices from '../../data/mockServices';

const initialForm = {
    name: '',
    code: '',
    value: '',
    qty: '',
    description: '',
    image: '',
};

const ServicesForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id && id !== 'new');

    const {
        form,
        setForm,
        loading,
        error,
        success,
        handleChange,
        handleImageChange,
        handleDescriptionChange,
        handleSubmit,
        setError,
        setSuccess,
        imagePreview,
        setImagePreview,
    } = useForm({
        initialForm,
        data: mockServices,
        id,
        isEdit,
        fields: ['name', 'code', 'value', 'qty', 'description'],
        onSubmit: (formData, { setError, setSuccess, setLoading }) => {
            if (isEdit) {
                setSuccess('Service updated successfully!');
                toast.success('Service updated successfully!');
            } else {
                const newService = {
                    ...formData,
                    id: Date.now().toString(),
                    value: parseFloat(formData.value),
                    qty: parseInt(formData.qty),
                    createdAt: new Date().toISOString().slice(0, 10),
                    updatedAt: new Date().toISOString().slice(0, 10),
                };
                setSuccess('Service added successfully!');
                toast.success('Service added successfully!');
            }
            setLoading(false);
            setTimeout(() => navigate('/services'), 1200);
        },
        imageField: 'image',
        descriptionField: 'description',
    });

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

                    {error && error !== '' && (
                        <div className="error-banner">{typeof error === 'string' ? error : error.message}</div>
                    )}
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
