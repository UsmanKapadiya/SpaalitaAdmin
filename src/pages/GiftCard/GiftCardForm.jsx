import React, { useRef, useEffect } from 'react';
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
  existingImages: [],
  newImages: [],
  imagePreviews: [],
  showPreview: false,
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
    handleDescriptionChange,
    handleSubmit,
    handleImageChange,
    setError,
    setSuccess,
  } = useForm({
    initialForm,
    data: [],
    id,
    isEdit,
    fields: ['name', 'sku', 'price', 'qty', 'description'],
    onSubmit: async (formData, { setError, setSuccess, setLoading }) => {
      try {
        const fd = new FormData();
        fd.append('productName', formData.name);
        fd.append('sku', formData.sku);
        fd.append('price', Number(formData.price));
        fd.append('qty', Number(formData.qty));
        fd.append('description', formData.description);
        fd.append('category', 'GiftCard');

        formData.existingImages.forEach(img => fd.append('existingImages[]', img));
        formData.newImages.forEach(file => fd.append('productImages', file));

        let resp;
        if (isEdit) {
          resp = await updateGiftCard(id, token, fd);
          setSuccess('Gift Card updated successfully!');
          toast.success('Gift Card updated successfully!');
        } else {
          resp = await createGiftCard(token, fd);
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
    },
  });

  useEffect(() => {
    const fetchGiftCard = async () => {
      if (isEdit && id) {
        try {
          const resp = await getGiftCardById(id, token);
          if (resp.success && resp.data) {
            const prod = resp.data;
            const existingImages = Array.isArray(prod.productImages) ? prod.productImages : [];
            setForm(f => ({
              ...f,
              name: prod.productName || '',
              sku: prod.sku || '',
              price: prod.price || '',
              qty: prod.qty || '',
              description: prod.description || '',
              existingImages,
              imagePreviews: existingImages,
            }));
          }
        } catch {
          toast.error('Failed to fetch gift card details');
        }
      }
    };
    fetchGiftCard();
  }, [isEdit, id]);

  const handleRemoveImage = (index, isExisting) => {
    setForm(prev => {
      if (isExisting) {
        const updatedExisting = [...prev.existingImages];
        updatedExisting.splice(index, 1);
        const updatedPreviews = [...prev.imagePreviews];
        updatedPreviews.splice(index, 1);
        return { ...prev, existingImages: updatedExisting, imagePreviews: updatedPreviews };
      } else {
        const updatedNew = [...prev.newImages];
        updatedNew.splice(index - prev.existingImages.length, 1);
        const updatedPreviews = [...prev.imagePreviews];
        updatedPreviews.splice(index, 1);
        return { ...prev, newImages: updatedNew, imagePreviews: updatedPreviews };
      }
    });
  };


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
      const images = [...f.newImages];
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

  return (
    <DashboardLayout>
      <div className="edit-product-page">
        <div className="edit-form-card">
          <PageTitle
            title={isEdit ? 'Update Gift Card' : 'Add Gift Card'}
            subTitle={isEdit ? 'Edit gift card details and save changes.' : 'Fill in the details to add a new gift card.'}
            button={false}
          />
          {success && <div className="success-banner">{success}</div>}
          {error && <div className="error-banner">{error.message || error}</div>}

          <form onSubmit={handleSubmit} className="edit-form" autoComplete="off">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label form-label-required">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label form-label-required">Code</label>
                <input
                  type="text"
                  name="sku"
                  className="form-input"
                  value={form.sku}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label form-label-required">Value</label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label form-label-required">Quantity</label>
                <input
                  type="number"
                  name="qty"
                  className="form-input"
                  value={form.qty}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Images */}
            <div className="form-group form-group-full">
              <label className="form-label">Gift Card Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-input file-input"
              />
              {form.imagePreviews.length > 0 && (
                <div className="image-preview-wrapper" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {form.imagePreviews && form.imagePreviews.length > 0 && (
                    <div className="image-preview-wrapper" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {form.imagePreviews.map((img, i) => {
                        const isExisting = i < form.existingImages.length;
                        return (
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
                              onClick={() => handleRemoveImage(i, isExisting)} // ✅ Pass isExisting
                              aria-label="Remove image"
                              variant="danger"
                            >
                              &#10005;
                            </Button>
                            {i === 0 && (
                              <span className="main-image-label">Main</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group form-group-full">
              <label className="form-label form-label-required">Description</label>
              <div className="editor-wrapper-quill">
                <ReactQuill
                  value={form.description || ''}
                  onChange={handleDescriptionChange}
                  theme="snow"
                  style={{ minHeight: 200 }}
                />
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit" className="btn-add" disabled={loading}>
                {loading ? (isEdit ? 'Updating...' : 'Adding...') : isEdit ? 'Update Gift Card' : 'Add Gift Card'}
              </Button>
              <Button type="button" className="btn-secondary" variant="secondary" onClick={() => navigate('/giftCards')} disabled={loading}>
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
