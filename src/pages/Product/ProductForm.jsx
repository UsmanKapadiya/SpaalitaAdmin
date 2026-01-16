import React, { useState, useCallback, useRef } from 'react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditProduct.css';
import { toast } from 'react-toastify';

const initialProduct = () => ({
  name: '',
  sku: '',
  price: '',
  qty: '',
  description: '',
  images: [], // array of base64 or url
  imagePreviews: [],
  showPreview: false,
});

import { useParams } from 'react-router-dom';

const ProductForm = ({ products, setProducts }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isNewItem = id === 'new';
  const [form, setForm] = useState(() => {
    if (!isNewItem && id && products) {
      const prod = products.find(p => p.id === id);
      if (prod) {
        return {
          ...prod,
          price: String(prod.price),
          qty: String(prod.qty),
          images: prod.images || [],
          imagePreviews: prod.imagePreviews || prod.images || [],
          showPreview: false,
        };
      }
    }
    return initialProduct();
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ field: '', message: '' });
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError({ field: '', message: '' });
    setSuccess('');
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const readers = files.map(file => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then(results => {
        setForm(f => ({
          ...f,
          images: [...(f.images || []), ...results],
          imagePreviews: [...(f.imagePreviews || []), ...results]
        }));
      });
    } else {
      setForm(f => ({ ...f, images: [], imagePreviews: [] }));
    }
    setError({ field: '', message: '' });
    setSuccess('');
  };

  // Remove image by index
  const handleRemoveImage = idx => {
    setForm(f => {
      const newImages = f.images.filter((_, i) => i !== idx);
      const newPreviews = f.imagePreviews.filter((_, i) => i !== idx);
      return { ...f, images: newImages, imagePreviews: newPreviews };
    });
  };

  // Drag and drop for image reordering
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (idx) => {
    dragItem.current = idx;
  };

  const handleDragEnter = (idx) => {
    dragOverItem.current = idx;
  };

  const handleDragEnd = () => {
    setForm(f => {
      const images = [...f.images];
      const previews = [...f.imagePreviews];
      const dragIdx = dragItem.current;
      const hoverIdx = dragOverItem.current;
      if (dragIdx === undefined || hoverIdx === undefined || dragIdx === hoverIdx) return f;
      // Move image
      const [draggedImg] = images.splice(dragIdx, 1);
      images.splice(hoverIdx, 0, draggedImg);
      // Move preview
      const [draggedPrev] = previews.splice(dragIdx, 1);
      previews.splice(hoverIdx, 0, draggedPrev);
      return { ...f, images, imagePreviews: previews };
    });
    dragItem.current = undefined;
    dragOverItem.current = undefined;
  };

  const handleDescriptionChange = useCallback((value) => {
    setForm(f => ({ ...f, description: value }));
    setError({ field: '', message: '' });
    setSuccess('');
  }, []);

  const handlePreviewToggle = () => {
    setForm(f => ({ ...f, showPreview: !f.showPreview }));
  };

  // Validation function for form fields
  const validateForm = (data) => {
    if (!data.name || data.name.trim() === '') {
      return { field: 'name', message: 'Please fill in this field' };
    }
    if (!data.sku || data.sku.trim() === '') {
      return { field: 'sku', message: 'Please fill in this field' };
    }
    if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
      return { field: 'price', message: 'Please fill in this field' };
    }
    if (!data.qty || isNaN(data.qty) || Number(data.qty) < 0) {
      return { field: 'qty', message: 'Please fill in this field' };
    }
    if (!data.description || data.description.trim() === '') {
      return { field: 'description', message: 'Please fill in this field' };
    }
    return null;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError({ field: '', message: '' });
    setSuccess('');
    setLoading(true);
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }
    if (!isNewItem) {
      setSuccess('Product updated successfully!');
      toast.success('Product updated successfully!');
    } else {
      const newProduct = {
        ...form,
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        price: parseFloat(form.price),
        qty: parseInt(form.qty),
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
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
            <h1 className="edit-form-title">{isNewItem ? 'Add Product' : 'Update Product'}</h1>
            <p className="edit-form-subtitle">
              {isNewItem
                ? 'Fill in the details to add a new product.'
                : 'Edit product details and save changes.'}
            </p>
          </div>
          {success && <div className="success-banner">{success}</div>}
          <form onSubmit={handleSubmit} className="edit-form" autoComplete="off">
            <div className="single-product-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  {error.field === 'name' && (
                    <div className="input-error">{error.message}</div>
                  )}
                
                </div>
                <div className="form-group">
                  <label className="form-label form-label-required">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    className="form-input"
                    placeholder="Stock Keeping Unit"
                    value={form.sku}
                    onChange={handleChange}
                    required
                  />
                  {error.field === 'sku' && (
                    <div className="input-error">{error.message}</div>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Price</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                  {error.field === 'price' && (
                    <div className="input-error">{error.message}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label form-label-required">Quantity</label>
                  <input
                    type="number"
                    name="qty"
                    className="form-input"
                    placeholder="0"
                    value={form.qty}
                    onChange={handleChange}
                    required
                  />
                  {error.field === 'qty' && (
                    <div className="input-error">{error.message}</div>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group form-group-full">
                  <label className="form-label">Product Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="form-input file-input"
                  />
                  {form.imagePreviews && form.imagePreviews.length > 0 && (
                    <div className="image-preview-wrapper" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {form.imagePreviews.map((img, i) => (
                        <div
                          key={i}
                          className="image-preview-container"
                          style={{ position: 'relative', cursor: 'grab' }}
                          draggable
                          onDragStart={() => handleDragStart(i)}
                          onDragEnter={() => handleDragEnter(i)}
                          onDragEnd={handleDragEnd}
                          onDragOver={e => e.preventDefault()}
                          title={i === 0 ? 'Main Image' : 'Drag to reorder'}
                        >
                          <img
                            src={img}
                            alt={`Product Preview ${i + 1}`}
                            className="image-preview"
                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: i === 0 ? '2px solid #007bff' : '1px solid #ccc' }}
                          />
                          <Button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => handleRemoveImage(i)}
                            aria-label="Remove image"
                            variant="danger"
                          >
                            &#10005;
                          </Button>
                          {i === 0 && (
                            <span className="main-image-label">Main</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="form-help-text">Upload one or more product images (optional, jpg/png/gif)</p>
                </div>
              </div>
              <div className="form-group form-group-full">
                <label className="form-label form-label-required">Description</label>
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
                {error.field === 'description' && (
                  <div className="input-error">{error.message}</div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                className="btn-add"
                disabled={loading}
                // variant="primary"
              >
                {loading ? 'Adding...' : 'Add Products'}
              </Button>
              <Button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/products')}
                disabled={loading}
                // variant="secondary"
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

export default ProductForm;
