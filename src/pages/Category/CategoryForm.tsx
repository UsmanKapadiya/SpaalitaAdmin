import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createCategory, getCategoryById, updateCategory } from '../../services/categoryServices'
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useForm from '../../hooks/useForm';
import PageTitle from '../../components/PageTitle/PageTitle';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const initialCategoryForm = {
    name: '',
    slug: '',
    description: '',
    image: null,
    imagePreview: '',
    parentId: '',
};

const CategoryForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { id } = useParams();
    const isEdit = Boolean(id && id !== 'new');
    const [allCategories, setAllCategories] = useState([]);
    const token = sessionStorage.getItem('authToken')?.replace(/^"|"$/g, '');

    const {
        form,
        setForm,
        loading,
        error,
        success,
        handleChange,
        setError,
        setSuccess,
        handleSubmit,
    } = useForm({
        initialForm: initialCategoryForm,
        id,
        isEdit,
        fields: ['name', 'slug', 'description'],
        onSubmit: async (formData, { setError, setSuccess, setLoading }) => {
            try {
                const form = new FormData();
                let resp;
                form.append("name", formData.name);
                form.append("slug", formData.slug);
                form.append("description", formData.description);
                form.append("parentId", formData.parentId || '');

                if (formData.image) {
                    form.append("image", formData.image);
                }

                if (isEdit) {
                    resp = await updateCategory(id, token, form);
                    if (resp?.success && resp?.success === true) {
                        setSuccess("Category updated successfully!");
                        toast.success("Category updated successfully!");
                    }
                } else {
                    resp = await createCategory(token, form);
                    if (resp?.success && resp?.success === true) {
                        setSuccess("Category created successfully!");
                        toast.success("Category created successfully!");
                    }
                }

                setLoading(false);
                setTimeout(() => navigate('/category'), 1200);

            } catch (err) {
                setLoading(false);
                setError({
                    message: err?.response?.message || 'Something went wrong',
                    field: null
                });
                toast.error(err?.response?.message || 'Something went wrong');
            }
        },
    });

    useEffect(() => {
        const populateForm = async () => {

            if (state?.allCategoryData) {
                const rootCategories = state.allCategoryData.filter(
                    cat => cat.depth === 0 && cat._id !== id
                );
                setAllCategories(rootCategories);
            }

            if (isEdit && id) {
                try {
                    const resp = await getCategoryById(id);
                    if (resp?.success) {
                        setForm(f => ({
                            ...f,
                            name: resp.data.name || '',
                            slug: resp.data.slug || '',
                            description: resp.data.description || '',
                            parentId: resp.data.parentId || 'none',
                            imagePreview: resp.data.image || '',
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching category:", error);
                }
            }
        };

        populateForm();
    }, [state, id, isEdit]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm(prev => ({
            ...prev,
            image: file,
            imagePreview: URL.createObjectURL(file),
        }));
    };

    return (
        <DashboardLayout>
            <div className="edit-product-page">
                <div className="edit-form-card">

                    <PageTitle
                        title={isEdit ? 'Update Category' : 'Add Category'}
                        subTitle={isEdit
                            ? 'Edit category details'
                            : 'Create a new category'}
                    />

                    {success && <div className="success-banner">{success}</div>}

                    <form onSubmit={handleSubmit} className="edit-form">

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* Parent Category */}
                        <div className="form-group">
                            <label className="form-label">Parent Category</label>
                            <select
                                name="parentId"
                                value={form.parentId || 'none'}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="none">None (Root)</option>
                                {allCategories.map(cat => {
                                    return (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group form-group-full">
                                <label className="form-label">Category Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="form-input file-input"
                                />

                                {form.imagePreview && (
                                    <div
                                        className="image-preview-container"
                                        style={{
                                            position: 'relative',
                                            display: 'inline-block',
                                            marginTop: 10,
                                            width: 'fit-content'
                                        }}
                                    >
                                        <img
                                            src={form.imagePreview}
                                            alt="Category Preview"
                                            style={{
                                                display: 'block',
                                                width: 120,
                                                height: 120,
                                                objectFit: 'cover',
                                                borderRadius: 6,
                                                border: '1px solid #ccc',
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                setForm(f => ({ ...f, imagePreview: null, image: null, }))
                                            }
                                            style={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                                padding: 2,
                                                zIndex: 10,
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                )}

                                <p className="form-help-text">Upload a category image (optional, jpg/png/gif)</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description</label>

                            <ReactQuill
                                theme="snow"
                                value={form.description || ''}
                                onChange={(val) =>
                                    setForm(prev => ({ ...prev, description: val }))
                                }
                            />
                        </div>

                        <div className="form-actions">
                            <Button
                                type="submit"
                                className="btn-add"
                                disabled={loading}
                            >
                                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Category' : 'Add Category')}
                            </Button>
                            <Button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate('/category')}
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

export default CategoryForm