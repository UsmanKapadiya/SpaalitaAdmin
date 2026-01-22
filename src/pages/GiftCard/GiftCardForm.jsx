

import React from 'react';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../GiftCard/EditGiftCard.css';
import { toast } from 'react-toastify';
import useForm from '../../hooks/useForm';
import mockGiftCards from '../../data/mockGiftCards';
import PageTitle from '../../components/PageTitle/PageTitle';

const initialForm = {
  name: '',
  code: '',
  value: '',
  qty: '',
  description: '',
  image: '',
};

const GiftCardForm = () => {
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
    data: mockGiftCards,
    id,
    isEdit,
    fields: ['name', 'code', 'value', 'qty', 'description'],
    onSubmit: (formData, { setError, setSuccess, setLoading }) => {
      if (isEdit) {
        setSuccess('Gift Card updated successfully!');
        toast.success('Gift Card updated successfully!');
      } else {
        const newGiftCard = {
          ...formData,
          id: Date.now().toString(),
          value: parseFloat(formData.value),
          qty: parseInt(formData.qty),
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString().slice(0, 10),
        };
        setSuccess('Gift Card added successfully!');
        toast.success('Gift Card added successfully!');
      }
      setLoading(false);
      setTimeout(() => navigate('/giftCards'), 1200);
    },
    imageField: 'image',
    descriptionField: 'description',
  });

  return (
    <DashboardLayout>
      <div className="edit-product-page">
        <div className="edit-form-card">          
          <PageTitle
            title= {isEdit ? 'Update Gift Card' : 'Add Gift Card'}
            subTitle= {isEdit ? 'Edit gift card details and save changes.' : 'Fill in the details to add a new gift card.'}
            button={false}
          />
          {error && error !== '' && (
            <div className="error-banner">{typeof error === 'string' ? error : error.message}</div>
          )}
          {success && <div className="success-banner">{success}</div>}

          <form onSubmit={handleSubmit} className="edit-form" autoComplete="off">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label form-label-required">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Enter gift card name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="code" className="form-label form-label-required">Code</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  className="form-input"
                  placeholder="Gift Card Code"
                  value={form.code}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="value" className="form-label form-label-required">Value</label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  className="form-input"
                  placeholder="0.00"
                  step="0.01"
                  value={form.value}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="qty" className="form-label form-label-required">Quantity</label>
                <input
                  type="number"
                  id="qty"
                  name="qty"
                  className="form-input"
                  placeholder="0"
                  value={form.qty}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group form-group-full">
                <label htmlFor="image" className="form-label">Gift Card Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-input file-input"
                />
                {imagePreview && (
                  <div className="image-preview-wrapper">
                    <img src={imagePreview} alt="Gift Card Preview" className="image-preview" />
                  </div>
                )}
                <p className="form-help-text">Upload a gift card image (optional, jpg/png/gif)</p>
              </div>
            </div>
            <div className="form-group form-group-full">
              <label htmlFor="description" className="form-label form-label-required">Description</label>
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
                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Gift Card' : 'Add Gift Card')}
              </Button>
              <Button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/giftCards')}
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

export default GiftCardForm;
// This file is now obsolete. All Gift Card add/edit logic is in GiftCard.jsx.
