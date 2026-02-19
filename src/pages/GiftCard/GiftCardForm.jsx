

import React, { useEffect } from 'react';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../GiftCard/EditGiftCard.css';
import { toast } from 'react-toastify';
import useForm from '../../hooks/useForm';
import PageTitle from '../../components/PageTitle/PageTitle';
import { createGiftCard, getGiftCardById, updateGiftCard } from '../../services/giftCardServices';

const initialForm = {
  name: '',
  sku: '',
  price: '',
  qty: '',
  description: '',
  image: '',
};

const GiftCardForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');
  const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');

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
    data: [], // Static data removed, ready for API integration
    id,
    isEdit,
    fields: ['name', 'sku', 'price', 'qty', 'description'],
    onSubmit: async (formData, { setError, setSuccess, setLoading }) => {
      try {
        const payload = {
          productName: formData.name,
          sku: formData.sku,
          price: Number(formData.price),
          qty: Number(formData.qty),
          productImages: Array.isArray(formData.images) ? formData.images : [],
          description: formData.description,
          category: 'GiftCard', // Always static
        };
        let resp;
        if (isEdit) {
          resp = await updateGiftCard(id, token, payload);
          setSuccess('Gift Card updated successfully!');
          toast.success('Gift Card updated successfully!');
        } else {
          resp = await createGiftCard(token, payload);
          setSuccess('Gift Card added successfully!');
          toast.success('Gift Card added successfully!');
        }
        setLoading(false);
        setTimeout(() => navigate('/giftCards'), 1200);
      } catch (err) {
        setLoading(false);
        setError({ message: err?.response?.data?.message || 'Something went wrong', field: null });
        toast.error(err?.response?.data?.message || 'Something went wrong');
      }
      // setSuccess(isEdit ? 'Gift Card updated successfully!' : 'Gift Card added successfully!');
      // toast.success(isEdit ? 'Gift Card updated successfully!' : 'Gift Card added successfully!');
      // setLoading(false);
      // setTimeout(() => navigate('/giftCards'), 1200);
    },
    imageField: 'image',
    descriptionField: 'description',
  });

  // Fetch product details if editing
  useEffect(() => {
    const fetchGiftCard = async () => {
      if (isEdit && id) {
        try {
          const resp = await getGiftCardById(id, token);
          if (resp && resp.success && resp.data) {
            const prod = resp.data;
            setForm(f => ({
              ...f,
              name: prod.productName || '',
              sku: prod.sku || '',
              price: prod.price || '',
              qty: prod.qty || '',
              description: prod.description || '',
              images: Array.isArray(prod.productImages) ? prod.productImages : [],
              imagePreviews: Array.isArray(prod.productImages) ? prod.productImages : [],
            }));
          }
        } catch (err) {
          toast.error('Failed to fetch giftCard details');
        }
      }
    };
    fetchGiftCard();
    // eslint-disable-next-line
  }, [isEdit, id]);

  return (
    <DashboardLayout>
      <div className="edit-product-page">
        <div className="edit-form-card">
          <PageTitle
            title={isEdit ? 'Update Gift Card' : 'Add Gift Card'}
            subTitle={isEdit ? 'Edit gift card details and save changes.' : 'Fill in the details to add a new gift card.'}
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
                <label htmlFor="sku" className="form-label form-label-required">Code</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  className="form-input"
                  placeholder="Gift Card Code"
                  value={form.sku}
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
                  id="price"
                  name="price"
                  className="form-input"
                  placeholder="0.00"
                  step="0.01"
                  value={form.price}
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
              <div className="editor-wrapper-quill">
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
