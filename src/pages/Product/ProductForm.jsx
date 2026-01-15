import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditProduct.css';
import { toast } from 'react-toastify';

const initialForm = {
  name: '',
  sku: '',
  price: '',
  qty: '',
  description: '',
  image: '', // base64 or url
};

const ProductForm = ({ products, setProducts }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEdit && products) {
      const prod = products.find(p => p.id === id);
      if (prod) {
        setForm({ ...prod, price: String(prod.price), qty: String(prod.qty) });
        setImagePreview(prod.image || '');
      }
    }
  }, [id, isEdit, products]);

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
    if (!form.name || !form.sku || !form.price || !form.qty || !form.description) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }
    if (isEdit) {
      setProducts(prev => prev.map(p => p.id === id ? { ...form, id, price: parseFloat(form.price), qty: parseInt(form.qty) } : p));
      setSuccess('Product updated successfully!');
      toast.success('Product updated successfully!');
    } else {
      const newProduct = {
        ...form,
        id: Date.now().toString(),
        price: parseFloat(form.price),
        qty: parseInt(form.qty),
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      setProducts(prev => [newProduct, ...prev]);
      setSuccess('Product added successfully!');
      toast.success('Product added successfully!');
    }
    setLoading(false);
    setTimeout(() => navigate('/products'), 1200);
  };

  return (
    <DashboardLayout>
      <div className="edit-product-page">
        <div className="edit-form-card">
          <div className="edit-form-header">
            <h1 className="edit-form-title">
              {isEdit ? 'Update Product' : 'Add Product'}
            </h1>
            <p className="edit-form-subtitle">
              {isEdit ? 'Edit product details and save changes.' : 'Fill in the details to add a new product.'}
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
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <p className="form-help-text">The product name</p>
              </div>
              <div className="form-group">
                <label htmlFor="sku" className="form-label form-label-required">SKU</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  className="form-input"
                  placeholder="Stock Keeping Unit"
                  value={form.sku}
                  onChange={handleChange}
                  required
                />
                <p className="form-help-text">Unique product code (SKU)</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price" className="form-label form-label-required">Price</label>
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
                <p className="form-help-text">Product price in USD</p>
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
                <p className="form-help-text">Available stock quantity</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group form-group-full">
                <label htmlFor="image" className="form-label">Product Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-input file-input"
                />
                {imagePreview && (
                  <div className="image-preview-wrapper">
                    <img src={imagePreview} alt="Product Preview" className="image-preview" />
                  </div>
                )}
                <p className="form-help-text">Upload a product image (optional, jpg/png/gif)</p>
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
                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Product' : 'Add Product')}
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/products')} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductForm;
