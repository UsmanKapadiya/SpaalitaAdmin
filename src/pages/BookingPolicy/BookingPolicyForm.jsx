
import React, { useState, useEffect, useCallback } from 'react';
import Switch from '@mui/material/Switch';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../GiftCard/EditGiftCard.css';
import { toast } from 'react-toastify';

const initialForm = {
  title: '',
  description: '',
  active: false,
};

const BookingPolicyForm = ({ giftCards, setGiftCards }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');
  const [form, setForm] = useState(initialForm);
  // Removed imagePreview state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEdit && giftCards) {
      const policy = giftCards.find(g => g.id === id);
      if (policy) {
        setForm({
          title: policy.title || '',
          description: policy.description || '',
          active: !!policy.active,
        });
      }
    }
  }, [id, isEdit, giftCards]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setError('');
    setSuccess('');
  };

  // Removed handleImageChange

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
    if (!form.title || !form.description) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }
    if (isEdit) {
      // setGiftCards(prev => prev.map(g => g.id === id ? { ...form, id } : g));
      setSuccess('Booking Policy updated successfully!');
      toast.success('Booking Policy updated successfully!');
    } else {
      const newPolicy = {
        ...form,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      // setGiftCards(prev => [newPolicy, ...prev]);
      setSuccess('Booking Policy added successfully!');
      toast.success('Booking Policy added successfully!');
    }
    setLoading(false);
    setTimeout(() => navigate('/bookingPolicy'), 1200);
  };

  return (
    <DashboardLayout>
      <div className="edit-product-page">
        <div className="edit-form-card">
          <div className="edit-form-header">
            <h1 className="edit-form-title">
              {isEdit ? 'Update Booking Policy' : 'Add Booking Policy'}
            </h1>
            <p className="edit-form-subtitle">
              {isEdit ? 'Edit gift card details and save changes.' : 'Fill in the details to add a new gift card.'}
            </p>
          </div>

          {error && <div className="error-banner">{error}</div>}
          {success && <div className="success-banner">{success}</div>}

          <form onSubmit={handleSubmit} className="edit-form" autoComplete="off">
            <div className="form-row">
              <div className="form-group form-group-full">
                <label htmlFor="title" className="form-label form-label-required">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  placeholder="Enter booking policy title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group form-group-full" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label htmlFor="active" className="form-label">Active</label>
                <Switch
                  id="active"
                  name="active"
                  checked={!!form.active}
                  onChange={handleChange}
                  color="primary"
                  inputProps={{ 'aria-label': 'Active Policy Toggle' }}
                />
                <span style={{ fontSize: 13, color: form.active ? '#388e3c' : '#888' }}>{form.active ? 'Active' : 'Inactive'}</span>
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
                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Booking Policy' : 'Add Booking Policy')}
              </Button>
              <Button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/bookingPolicy')}
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

export default BookingPolicyForm;
// This file is now obsolete. All Gift Card add/edit logic is in GiftCard.jsx.
