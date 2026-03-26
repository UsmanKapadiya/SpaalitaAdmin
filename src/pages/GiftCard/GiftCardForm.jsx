import React, { useRef, useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditGiftCard.css';
import { toast } from 'react-toastify';
import useForm from '../../hooks/useForm';
import mockProducts from '../../data/mockProducts';
import { createGiftCard, updateGiftCard, getGiftCardById } from '../../services/giftCardServices';
import { getCategorys } from '../../services/categoryServices';
import PageTitle from '../../components/PageTitle/PageTitle';
import Select from "react-select";


const initialForm = {
  name: '',
  sku: '',
  price: '',
  qty: '',
  description: '',
  short_description: '',
  slug: '',
  regular_price: '',
  sale_price: '',
  tax_status: 'none',
  shipping_required: true,
  shipping_taxable: false,
  stock_status: 'instock',
  categories: [],
  related_ids: [],
  existingImages: [],
  newImages: [],
  imagePreviews: [],
  showPreview: false,
};

const GiftCardForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');
  const token = sessionStorage.getItem('authToken')?.replace(/^"|"$/g, '');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
    fields: ['name', 'sku', 'price', 'qty', 'description',],
    onSubmit: async (formData, { setError, setSuccess, setLoading }) => {
      try {
        const form = new FormData();
        form.append("productName", formData.name);
        form.append("sku", formData.sku);
        form.append("price", Number(formData.price));
        form.append("qty", Number(formData.qty));
        form.append("description", formData.description);
        form.append("category", "Product");
        form.append("slug", formData.slug);
        form.append("regular_price", formData.regular_price);
        form.append("sale_price", formData.sale_price);
        form.append("short_description", formData.short_description);
        form.append("tax_status", formData.tax_status);
        form.append("shipping_required", formData.shipping_required);
        form.append("shipping_taxable", formData.shipping_taxable);
        form.append("stock_status", formData.stock_status);
        selectedCategories.forEach(cat => {
          form.append("categories[]", cat);
        });

        // form.append("related_ids", JSON.stringify(formData.related_idss));

        // Send existing images (filenames) so backend keeps them
        formData.existingImages.forEach(img => form.append("existingImages[]", img));
        // Send new files
        formData.newImages.forEach(file => form.append("productImages", file));

        let resp;

        if (isEdit) {
          resp = await updateGiftCard(id, token, form);
          setSuccess("Product updated successfully!");
          toast.success("Product updated successfully!");
        } else {
          resp = await createGiftCard(token, form);
          setSuccess("Product added successfully!");
          toast.success("Product added successfully!");
        }
        setLoading(false);
        setTimeout(() => navigate('/giftCards'), 1200);
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
  if (isEdit && id && categories.length > 0) { // ✅ IMPORTANT
    const fetchProduct = async () => {
      const resp = await getGiftCardById(id);

      if (resp?.success) {
        const cats = resp.data.categories || [];

        const catIds = cats.map(c => String(c._id)); // ✅ ensure string

        setSelectedCategories(catIds);

        setForm(f => ({
          ...f,
          name: resp.data.productName || '',
          sku: resp.data.sku || '',
          price: resp.data.price || '',
          qty: resp.data.qty || '',
          description: resp.data.description || '',
          short_description: resp.data.short_description || '',
          slug: resp.data.slug || '',
          regular_price: resp.data.regular_price || '',
          sale_price: resp.data.sale_price || '',
          tax_status: resp.data.tax_status || 'none',
          shipping_required: resp.data.shipping_required ?? true,
          shipping_taxable: resp.data.shipping_taxable ?? false,
          stock_status: resp.data.stock_status || 'instock',
          categories: catIds,
          related_ids: resp.data.related_ids || [],
          existingImages: resp.data.productImages || [],
          imagePreviews: resp.data.productImages || [],
        }));
      }
    };

    fetchProduct();
  }
}, [id, isEdit, categories]); // ✅ ADD categories here

  useEffect(() => {
    const fetchCategory = async () => {
      const resp = await getCategorys();
      if (resp?.success) {
        setCategories(resp?.data)
      }
    };
    fetchCategory();
  }, [])


  

  const categoryOptions = categories.map(parent => {
    // Parent option
    const parentOption = {
      label: parent.name,
      value: parent._id,
      isParent: true
    };

    // Children options (if any)
    const childrenOptions = parent.children?.map(child => ({
      label: child.name,
      value: child._id,
      parentId: parent._id,
      isChild: true
    })) || [];

    return {
      ...parentOption,
      options: childrenOptions
    };
  });

  const flatOptions = categories.flatMap(parent => {
    const parentOption = {
      label: parent.name,
      value: parent._id,
      isParent: true
    };

    const childrenOptions = parent.children?.map(child => ({
      label: child.name,
      value: child._id,
      parentId: parent._id,
      isChild: true
    })) || [];

    return [parentOption, ...childrenOptions];
  });



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
        const updatedPreviews = [...prev.imagePreviews];
        updatedNew.splice(index - prev.existingImages.length, 1);
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

  useEffect(() => {
    const qtyNum = parseInt(form.qty, 10);

    setForm((prev) => {
      if (qtyNum <= 0 && prev.stock_status !== "outofstock") {
        return { ...prev, stock_status: "outofstock" };
      } else if (qtyNum > 0 && prev.stock_status === "outofstock") {
        return { ...prev, stock_status: "instock" };
      }
      return prev;
    });
  }, [form.qty, setForm]);


  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  useEffect(() => {
    if (!form.name) return;

    if (!form.slugManuallyEdited) {
      setForm((prev) => ({
        ...prev,
        slug: generateSlug(prev.name)
      }));
    }
  }, [form.name]);

  const flatOptionsWithIndent = flatOptions.map(opt => {
    if (opt.isChild) {
      return {
        ...opt,
        label: `\u00A0\u00A0\u2014 ${opt.label}` // adds "  — " before child label
      };
    }
    return opt;
  });

  return (
    <DashboardLayout>
      <div className="edit-product-page">
        <div className="edit-form-card">
          <PageTitle
            title={isEdit ? 'Update GiftCards' : ' Add GiftCards'}
            subTitle={isEdit
              ? 'Fill in the details to add a new GiftCards.'
              : 'Edit GiftCards details and save changes.'}
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
                    placeholder="Enter giftCard name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    className="form-input"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="product-slug"
                  />
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
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                  {error && error.field === 'price' && (
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
                  <label className="form-label">Categories</label>
                  <Select
                    isMulti
                    options={flatOptionsWithIndent}
                    value={flatOptions.filter(opt =>
                      selectedCategories.includes(opt.value)
                    )}
                    onChange={(selected) => {
                      if (!selected || selected.length === 0) {
                        setSelectedCategories([]);
                        updateFormCategories([]);
                        return;
                      }

                      // Collect all selected IDs
                      const updated = selected.map(opt => opt.value);

                      setSelectedCategories(updated);
                      updateFormCategories(updated);
                    }}
                   
                    isOptionDisabled={(option, selected) => {
                      if (!selected || selected.length === 0) return false;

                      // Only one parent allowed at a time
                      const selectedParent = selected.find(o => o.isParent);

                      if (selectedParent) {
                        // Disable other parents
                        if (option.isParent && option.value !== selectedParent.value) return true;

                        // Only allow children of the selected parent
                        if (option.isChild && option.parentId !== selectedParent.value) return true;
                      }

                      // Only one child per parent
                      const selectedChild = selected.find(o => o.isChild && o.parentId === selectedParent?.value);
                      if (selectedChild && option.isChild && option.parentId === selectedParent?.value && option.value !== selectedChild.value) {
                        return true;
                      }

                      return false;
                    }}
                  />

                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Regular Price</label>
                  <input
                    type="number"
                    name="regular_price"
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={form.regular_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sale Price</label>
                  <input
                    type="number"
                    name="sale_price"
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={form.sale_price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Quantity</label>
                  <input
                    type="number"
                    name="qty"
                    className="form-input"
                    placeholder="0"
                    min="0"
                    value={form.qty}
                    onChange={handleChange} // global handler
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Status</label>
                  <select
                    name="stock_status"
                    className="form-input"
                    value={form.stock_status}
                    onChange={handleChange}
                  >
                    <option value="instock">In Stock</option>
                    <option value="outofstock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Shipping Required</label>
                  <select
                    name="shipping_required"
                    className="form-input"
                    value={form.shipping_required}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        shipping_required: e.target.value === 'true'
                      }))
                    }
                  >
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tax Status</label>
                  <select name="tax_status" className="form-input" value={form.tax_status} onChange={handleChange}>
                    <option value="none">None</option>
                    <option value="taxable">Taxable</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Shipping Taxable</label>
                  <select
                    name="shipping_taxable"
                    className="form-input"
                    value={form.shipping_taxable}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        shipping_taxable: e.target.value === 'true'
                      }))
                    }
                  >
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </select>
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
                      {form.imagePreviews.map((img, i) => {
                        // Determine if this image is from existingImages
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
                  <p className="form-help-text">Upload one or more product images (optional, jpg/png/gif)</p>
                </div>
              </div>

              <div className='form-row'>
                <div className="form-group form-group-full">
                  <label className="form-label">Short Description</label>
                  <textarea
                    name="short_description"
                    className="form-input"
                    value={form.short_description}
                    onChange={handleChange}
                  />
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
                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update GiftCards' : 'Add GiftCards')}
              </Button>
              <Button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/giftCards')}
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

export default GiftCardForm;
