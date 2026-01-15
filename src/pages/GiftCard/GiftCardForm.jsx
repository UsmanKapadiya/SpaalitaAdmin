
import React, { useState, useEffect, useCallback } from 'react';
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

const GiftCardForm = ({ giftCards, setGiftCards }) => {
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
    if (isEdit && giftCards) {
      const card = giftCards.find(g => g.id === id);
      if (card) {
        setForm({ ...card, value: String(card.value), qty: String(card.qty) });
        setImagePreview(card.image || '');
      }
    }
  }, [id, isEdit, giftCards]);

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
      setGiftCards(prev => prev.map(g => g.id === id ? { ...form, id, value: parseFloat(form.value), qty: parseInt(form.qty) } : g));
      setSuccess('Gift Card updated successfully!');
      toast.success('Gift Card updated successfully!');
    } else {
      const newGiftCard = {
        ...form,
        id: Date.now().toString(),
        value: parseFloat(form.value),
        qty: parseInt(form.qty),
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      setGiftCards(prev => [newGiftCard, ...prev]);
      setSuccess('Gift Card added successfully!');
      toast.success('Gift Card added successfully!');
    }
    setLoading(false);
    setTimeout(() => navigate('/giftCards'), 1200);
  };

  return (
    <DashboardLayout>
      <div className="edit-product-page">
        <div className="edit-form-card">
          <div className="edit-form-header">
            <h1 className="edit-form-title">
              {isEdit ? 'Update Gift Card' : 'Add Gift Card'}
            </h1>
            <p className="edit-form-subtitle">
              {isEdit ? 'Edit gift card details and save changes.' : 'Fill in the details to add a new gift card.'}
            </p>
          </div>

          {error && <div className="error-banner">{error}</div>}
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
                <p className="form-help-text">The gift card name</p>
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
                <p className="form-help-text">Unique gift card code</p>
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
                <p className="form-help-text">Gift card value in USD</p>
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
                <p className="form-help-text">Available quantity</p>
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
              <p className="form-help-text">Use the toolbar to format text, add links, images, and more.</p>
              <button
                type="button"
                className="preview-toggle"
                onClick={() => setShowPreview(!showPreview)}
                disabled={!form.description || !form.description.trim()}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              {showPreview && form.description && form.description.trim() && (
                <div className="html-preview">
                  <div dangerouslySetInnerHTML={{ __html: form.description }} />
                </div>
              )}
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary gradient-btn"
                disabled={loading}
              >
                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Gift Card' : 'Add Gift Card')}
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/giftCards')} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GiftCardForm;
// This file is now obsolete. All Gift Card add/edit logic is in GiftCard.jsx.
