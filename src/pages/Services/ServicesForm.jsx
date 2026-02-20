

import React, { useEffect } from 'react';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../GiftCard/EditGiftCard.css';
import { toast } from 'react-toastify';
import useForm from '../../hooks/useForm';
import mockServices from '../../data/mockServices';
import { createService, getServiceById, updateService } from '../../services/services';
import { useAuth } from '../../context/AuthContext';
import PageTitle from '../../components/PageTitle/PageTitle';

const initialForm = {
    name: '',
    code: '',
    value: '',
    qty: '',
    description: '',
    image: '',
    buttonUrl: '', // Optional field for button url
};

const ServicesForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id && id !== 'new');
    const { user } = useAuth();
    const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
    console.log(id)
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
        fields: ['name', 'description',],
        // fields removed: validation handled in useForm, buttonUrl is optional
        onSubmit: async (formData, { setError, setSuccess, setLoading }) => {
            // Only pass the required keys in the payload
            const payload = {
                serviceName: formData.name,
                serviceImage: formData.image,
                serviceDescription: formData.description,
                buttonUrl: formData.buttonUrl,
            };
            try {
                let response;
                if (isEdit) {
                    response = await updateService(id, token, payload);
                    if (response.success) {
                        setSuccess('Service updated successfully!');
                        toast.success('Service updated successfully!');
                    } else {
                        setError(response.error || 'Failed to update service');
                        toast.error(response.error || 'Failed to update service');
                        setLoading(false);
                        return;
                    }
                } else {
                    response = await createService(token, payload);
                    if (response.success) {
                        setSuccess('Service added successfully!');
                        toast.success('Service added successfully!');
                    } else {
                        setError(response.error || 'Failed to add service');
                        toast.error(response.error || 'Failed to add service');
                        setLoading(false);
                        return;
                    }
                }
                setLoading(false);
                setTimeout(() => navigate('/services'), 1200);
            } catch (err) {
                setError('An error occurred.');
                toast.error('An error occurred.');
                setLoading(false);
            }
        },
        imageField: 'image',
        descriptionField: 'description',
    });

    useEffect(() => {
        const fetchServices = async () => {
            if (isEdit && id) {
                try {
                    const resp = await getServiceById(id);
                    console.log(resp)
                    if (resp && resp.success && resp.data) {
                        const prod = resp.data;
                        setForm(f => ({
                            ...f,
                            name: prod.serviceName || '',
                            description: prod.serviceDescription || '',
                            buttonUrl: prod.buttonUrl || '',
                            image: prod.serviceImage || '',
                        }));
                        if (prod.serviceImage) {
                            setImagePreview(prod.serviceImage);
                        }
                    }
                } catch (err) {
                    toast.error('Failed to fetch product details');
                }
            }
        };
        fetchServices();
        // eslint-disable-next-line
    }, [isEdit, id]);

    function stripHtmlTags(str) {
        if (!str) return '';
        return str.replace(/<[^>]*>?/gm, '');
    }

    return (
        <DashboardLayout>
            <div className="edit-product-page">
                <div className="edit-form-card">
                    <PageTitle
                        title={isEdit ? 'Update Service' : 'Add Service'}
                        subTitle={isEdit ? 'Edit service details and save changes.' : 'Fill in the details to add a new service.'}
                        button={false}
                    />
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
                        <div className="form-row">
                            <div className="form-group form-group-full">
                                <label htmlFor="buttonUrl" className="form-label">Button URL (optional)</label>
                                <input
                                    type="text"
                                    id="buttonUrl"
                                    name="buttonUrl"
                                    className="form-input"
                                    value={form.buttonUrl || ''}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                />
                                <p className="form-help-text">Provide a URL for the service button (optional)</p>
                            </div>
                        </div>
                        <div className="form-group form-group-full">
                            <label htmlFor="description" className="form-label form-label-required">Service Description</label>
                            <div className="editor-wrapper-quill">
                                <ReactQuill
                                    theme="snow"
                                    value={form.description}
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
                                    style={{ maxHeight: 300, overflow: 'auto' }}
                                />
                            </div>
                            <style>{`
                                             .editor-wrapper-quill .ql-container {
                                               max-height: 200px;
                                             }
                                             .editor-wrapper-quill .ql-editor {
                                               max-height: 200px;
                                               overflow-y: auto;
                                             }
                                             .editor-wrapper-quill .ql-toolbar {
                                               position: sticky;
                                               top: 0;
                                               z-index: 2;
                                               background: #fff;
                                             }
                                           `}</style>
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
