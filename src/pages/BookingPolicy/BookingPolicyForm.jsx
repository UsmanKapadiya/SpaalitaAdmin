
import React, { useState, useEffect, useCallback } from 'react';
import Switch from '@mui/material/Switch';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../GiftCard/EditGiftCard.css';
import { toast } from 'react-toastify';
import { getBookingPolicyById, createBookingPolicy, updateBookingPolicy } from '../../services/bookingPolicyService';
const initialForm = {
  title: '',
  description: '',
  buttonUrl: '',
  status: false,
};

const BookingPolicyForm = ({ policies, setPolicies }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchPolicy() {
      if (isEdit && id) {
        setLoading(true);
        try {
          const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
          const resp = await getBookingPolicyById(id, token);
          if (resp && resp.success && resp.data) {
            setForm({
              title: resp.data.title || '',
              description: resp.data.description || '',
              buttonUrl: resp.data.buttonUrl || '',
              status: resp.data.status === 'active',
            });
          } else {
            setError(resp?.error || 'Failed to fetch booking policy');
          }
        } catch (err) {
          setError('Failed to fetch booking policy');
        }
        setLoading(false);
      }
    }
    fetchPolicy();
  }, [id, isEdit, policies]);

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
    const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
    const apiForm = {
      ...form,
      status: form.status ? 'active' : 'Inactive',
    };
    if (isEdit) {
      updateBookingPolicy(id, token, apiForm)
        .then(resp => {
          if (resp && resp.success) {
            setSuccess('Booking Policy updated successfully!');
            toast.success('Booking Policy updated successfully!');
          } else {
            setError(resp?.error || 'Failed to update booking policy');
            toast.error(resp?.error || 'Failed to update booking policy');
          }
        })
        .catch(() => {
          setError('Failed to update booking policy');
          toast.error('Failed to update booking policy');
        })
        .finally(() => {
          setLoading(false);
          setTimeout(() => navigate('/bookingPolicy'), 1200);
        });
    } else {
      createBookingPolicy(token, apiForm)
        .then(resp => {
          if (resp && resp.success) {
            setSuccess('Booking Policy added successfully!');
            toast.success('Booking Policy added successfully!');
          } else {
            setError(resp?.error || 'Failed to add booking policy');
            toast.error(resp?.error || 'Failed to add booking policy');
          }
        })
        .catch(() => {
          setError('Failed to add booking policy');
          toast.error('Failed to add booking policy');
        })
        .finally(() => {
          setLoading(false);
          setTimeout(() => navigate('/bookingPolicy'), 1200);
        });
    }
  };

  return (
    <DashboardLayout>
      <div className="edit-product-page">
        <div className="edit-form-card">
          <PageTitle
            title={isEdit ? 'Update Booking Policy' : 'Add Booking Policy'}
            subTitle={isEdit ? 'Edit gift card details and save changes.' : 'Fill in the details to add a new gift card.'}
            button={false}
          />
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
              <div className="form-group form-group-full" style={{ display: 'block', alignItems: 'center', gap: 12 }}>
                <label htmlFor="active" className="form-label">Active</label>
                <label htmlFor="status" className="form-label">Status</label>
                  <Switch
                    id="status"
                    name="status"
                    checked={!!form.status}
                    onChange={handleChange}
                    color="primary"
                    inputProps={{ 'aria-label': 'Status Policy Toggle' }}
                  />
                  <span style={{ fontSize: 13, color: form.status ? '#388e3c' : '#888' }}>{form.status ? 'Active' : 'Inactive'}</span>
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
              <label htmlFor="description" className="form-label form-label-required">Description</label>
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

