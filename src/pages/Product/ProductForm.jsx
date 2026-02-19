
import React, { useRef, useEffect } from 'react';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditProduct.css';
import { toast } from 'react-toastify';
import useForm from '../../hooks/useForm';
import mockProducts from '../../data/mockProducts';
import { createProduct, updateProduct, getProductById } from '../../services/productService';
import PageTitle from '../../components/PageTitle/PageTitle';

const initialForm = {
  name: '',
  sku: '',
  price: '',
  qty: '',
  description: '',
  images: [],
  imagePreviews: [],
  showPreview: false,
};

const ProductForm = () => {
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
  } = useForm({
    initialForm,
    data: mockProducts,
    id,
    isEdit,
    fields: ['name', 'sku', 'price', 'qty', 'description', 'images',],
    onSubmit: async (formData, { setError, setSuccess, setLoading }) => {
      try {
        const payload = {
          productName: formData.name,
          sku: formData.sku,
          price: Number(formData.price),
          qty: Number(formData.qty),
          productImages: Array.isArray(formData.images) ? formData.images : [],
          description: formData.description,
          category: 'Product', // Always static
        };
        let resp;
        if (isEdit) {
          resp = await updateProduct(id, token, payload);
          setSuccess('Product updated successfully!');
          toast.success('Product updated successfully!');
        } else {
          resp = await createProduct(token, payload);
          setSuccess('Product added successfully!');
          toast.success('Product added successfully!');
        }
        setLoading(false);
        setTimeout(() => navigate('/product'), 1200);
      } catch (err) {
        setLoading(false);
        setError({ message: err?.response?.data?.message || 'Something went wrong', field: null });
        toast.error(err?.response?.data?.message || 'Something went wrong');
      }
    },
    imageField: 'images',
    descriptionField: 'description',
  });

  // Fetch product details if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (isEdit && id) {
        try {
          const resp = await getProductById(id);
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
          toast.error('Failed to fetch product details');
        }
      }
    };
    fetchProduct();
    // eslint-disable-next-line
  }, [isEdit, id]);

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

  const handlePreviewToggle = () => {
    setForm(f => ({ ...f, showPreview: !f.showPreview }));
  };

  return (
    <DashboardLayout>
      <div className="edit-product-page">
        <div className="edit-form-card">
          <PageTitle
            title={isEdit ? 'Update Product' : ' Add Product'}
            subTitle={isEdit
              ? 'Fill in the details to add a new product.'
              : 'Edit product details and save changes.'}
            button={false}
          />
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
                  {error && error.field === 'name' && (
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
                  {error && error.field === 'sku' && (
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
                  {error && error.field === 'price' && (
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
                  {error && error.field === 'qty' && (
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
                {error && error.field === 'description' && (
                  <div className="input-error">{error.message}</div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                className="btn-add"
                disabled={loading}
              >
                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Products' : 'Add Products')}
              </Button>
              <Button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/products')}
                disabled={loading}
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
