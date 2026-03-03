

import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { toast } from 'react-toastify';
import useForm from '../../hooks/useForm';
import PageTitle from '../../components/PageTitle/PageTitle';
import { getGiftCards } from '../../services/giftCardServices';
import { getProducts } from '../../services/productService';
import Select from "react-select";
import { createCoupon, getCouponById, updateCoupon } from '../../services/couponServices';
import '../Coupon/Coupon.css';

const initialForm = {
    couponCode: '',
    discountType: '',
    couponAmount: '',
    allowFreeShiping: '', //Checkbox
    couponExpiryDate: '',
    minimumSpend: '',
    maximumSpend: '',
    products: [], // multiple products selected
    excludeProducts: [], // multiple Exclude products selected
    category: [], // multiple category selected
    excludeCategory: [], // multiple Exclude category selected
    usageLimitPerCoupon: '',
    usageLimitPerUser: '',
};

const CouponForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id && id !== 'new');
    const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
    const [products, setProducts] = useState([]);
    const [giftCard, setGiftCard] = useState([])
    const {
        form,
        setForm,
        loading,
        error,
        success,
        handleChange,
        handleImageChange,        // optional, if coupon has image
        handleDescriptionChange,  // optional, if coupon has description editor
        handleSubmit,
        setError,
        setSuccess,
    } = useForm({
        initialForm, // your coupon initialForm
        data: [],    // ready for API integration
        id,
        isEdit,
        fields: [
            'couponCode',
            'discountType',
            'couponAmount',
            // 'allowFreeShiping',
            'couponExpiryDate',
            'minimumSpend',
            'maximumSpend',
            'products',
            'excludeProducts',
            'category',
            'excludeCategory',
            'usageLimitPerCoupon',
            'usageLimitPerUser'
        ],
        onSubmit: async (formData, { setError, setSuccess, setLoading }) => {
            try {
                const payload = {
                    code: formData.couponCode,
                    discountType: formData.discountType,
                    discountValue: Number(formData.couponAmount),
                    allowFreeShipping: !!formData.allowFreeShiping,
                    expiryDate: formData.couponExpiryDate,
                    minOrderAmount: formData.minimumSpend ? Number(formData.minimumSpend) : 0,
                    maxOrderAmount: formData.maximumSpend ? Number(formData.maximumSpend) : null,
                    products: formData.products || [],
                    excludeProducts: formData.excludeProducts || [],
                    categories: formData.category || [],
                    excludeCategories: formData.excludeCategory || [],
                    usageLimitPerCoupon: formData.usageLimitPerCoupon ? Number(formData.usageLimitPerCoupon) : null,
                    usageLimitPerUser: formData.usageLimitPerUser ? Number(formData.usageLimitPerUser) : null,
                };

                let resp;
                if (isEdit) {
                    resp = await updateCoupon(id, token, payload);
                    setSuccess('Coupon updated successfully!');
                    toast.success('Coupon updated successfully!');
                } else {
                    resp = await createCoupon(token, payload);
                    setSuccess('Coupon added successfully!');
                    toast.success('Coupon added successfully!');
                }

                setLoading(false);
                setTimeout(() => navigate('/coupon'), 1200);

            } catch (err) {
                setLoading(false);
                setError({ message: err?.resp?.data?.message || 'Something went wrong', field: null });
                toast.error(err?.resp?.data?.message || 'Something went wrong');
            }
        },
    });

    const fetchGiftCard = async () => {
        try {
            const resp = await getGiftCards();
            if (resp && resp.success && resp.data) {
                const prod = resp.data;
                setGiftCard(prod);
            }
        } catch (err) {
            toast.error('Failed to fetch giftCard details');
        }
    };

    const fetchProducts = async () => {
        try {
            const resp = await getProducts();
            if (resp && resp.success && resp.data) {
                const prod = resp.data;
                setProducts(prod);
            }
        } catch (err) {
            toast.error('Failed to fetch giftCard details');
        }
    }

    useEffect(() => {
        fetchGiftCard();
        fetchProducts();
    }, [])


    // Fetch product details if editing
    useEffect(() => {
        const fetchSingleCoupon = async () => {
            if (isEdit && id) {
                try {
                    const resp = await getCouponById(id, token);
                    if (resp && resp.success && resp.data) {
                        const prod = resp.data;
                        setForm(f => ({
                            ...f,
                            couponCode: prod.code || '',
                            discountType: prod.discountType || '',
                            couponAmount: prod.discountValue || '',
                            allowFreeShiping: prod.allowFreeShipping || false,
                            couponExpiryDate: prod.expiryDate ? new Date(prod.expiryDate).toISOString().slice(0, 10) : '', // YYYY-MM-DD
                            minimumSpend: prod.minOrderAmount || '',
                            maximumSpend: prod.maxOrderAmount || '',
                            products: Array.isArray(prod.products) ? prod.products.map(p => p._id) : [],
                            excludeProducts: Array.isArray(prod.excludeProducts) ? prod.excludeProducts.map(p => p._id) : [],
                            category: Array.isArray(prod.categories) ? prod.categories : [],
                            excludeCategory: Array.isArray(prod.excludeCategories) ? prod.excludeCategories : [],
                            usageLimitPerCoupon: prod.usageLimitPerCoupon || '',
                            usageLimitPerUser: prod.usageLimitPerUser || ''
                        }));
                    }
                } catch (err) {
                    toast.error('Failed to fetch giftCard details');
                }
            }
        };
        fetchSingleCoupon();
        // eslint-disable-next-line
    }, [isEdit, id]);

    const mergedProductOptions = [
        ...giftCard.map(product => ({
            value: product._id,
            label: product.productName
        })),
        ...products.map(product => ({
            value: product._id,
            label: product.productName
        }))
    ];

    return (
        <DashboardLayout>
            <div className="edit-product-page">
                <div className="edit-form-card">
                    <PageTitle
                        title={isEdit ? 'Update Coupon' : 'Add Coupon'}
                        subTitle={isEdit ? 'Edit Coupon details and save changes.' : 'Fill in the details to add a new Coupon.'}
                        button={false}
                    />
                    {error && error !== '' && (
                        <div className="error-banner">{typeof error === 'string' ? error : error.message}</div>
                    )}
                    {success && <div className="success-banner">{success}</div>}

                    <form onSubmit={handleSubmit} className="edit-form" autoComplete="off">

                        {/* Coupon Code + Discount Type */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Coupon Code</label>
                                <input
                                    type="text"
                                    name="couponCode"
                                    className="form-input"
                                    placeholder="Enter coupon code"
                                    value={form.couponCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label-required">Discount Type</label>
                                <select
                                    name="discountType"
                                    className="form-input"
                                    value={form.discountType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>
                        </div>

                        {/* Coupon Amount + Free Shipping */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Coupon Amount</label>
                                <input
                                    type="number"
                                    name="couponAmount"
                                    className="form-input"
                                    placeholder="Enter amount"
                                    value={form.couponAmount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label-required">Expiry Date</label>
                                <input
                                    type="date"
                                    name="couponExpiryDate"
                                    className="form-input"
                                    value={form.couponExpiryDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Expiry + Minimum Spend */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Minimum Spend</label>
                                <input
                                    type="number"
                                    name="minimumSpend"
                                    className="form-input"
                                    value={form.minimumSpend}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Maximum Spend</label>
                                <input
                                    type="number"
                                    name="maximumSpend"
                                    className="form-input"
                                    value={form.maximumSpend}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Maximum Spend */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Allow Free Shipping</label>

                                <div className="checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        name="allowFreeShiping"
                                        checked={form.allowFreeShiping}
                                        onChange={(e) =>
                                            setForm({ ...form, allowFreeShiping: e.target.checked })
                                        }
                                    />
                                    <span className="checkbox-text">
                                        Check this box if the coupon grants free shipping.
                                        A free shipping method must be enabled in your shipping
                                        settings zone and be set to require "a valid free shipping
                                        coupon".
                                    </span>
                                </div>
                            </div>

                            <div className="form-group"></div>
                        </div>
                        {/* Usage Limits */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Usage Limit Per Coupon</label>
                                <input
                                    type="number"
                                    name="usageLimitPerCoupon"
                                    className="form-input"
                                    value={form.usageLimitPerCoupon}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Usage Limit Per User</label>
                                <input
                                    type="number"
                                    name="usageLimitPerUser"
                                    className="form-input"
                                    value={form.usageLimitPerUser}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Products (Multi Select) */}
                        <div className="form-group form-group-full" style={{ marginBottom: "20px" }}>
                            <label className="form-label">Products</label>
                            <Select
                                isMulti
                                options={mergedProductOptions}
                                value={mergedProductOptions.filter(option =>
                                    form.products.includes(option.value)
                                )}
                                onChange={(selectedOptions) =>
                                    setForm({
                                        ...form,
                                        products: selectedOptions
                                            ? selectedOptions.map(option => option.value)
                                            : []
                                    })
                                }
                                placeholder="Search and select products..."
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>

                        {/* Exclude Products */}
                        <div className="form-group form-group-full" style={{ marginBottom: "20px" }}>
                            <label className="form-label mt-2 pt-2">Exclude Products</label>
                            <Select
                                isMulti
                                options={mergedProductOptions}
                                value={mergedProductOptions.filter(option =>
                                    form.excludeProducts.includes(option.value)
                                )}
                                onChange={(selectedOptions) =>
                                    setForm({
                                        ...form,
                                        excludeProducts: selectedOptions
                                            ? selectedOptions.map(option => option.value)
                                            : []
                                    })
                                }
                                placeholder="Search and select products..."
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>

                        {/* Categories */}
                        {/* <div className="form-group form-group-full">
                            <label className="form-label">Categories</label>
                            <select
                                multiple
                                name="category"
                                className="form-input"
                                value={form.category}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        category: Array.from(e.target.selectedOptions, option => option.value)
                                    })
                                }
                            />
                        </div> */}

                        {/* Exclude Categories */}
                        {/* <div className="form-group form-group-full">
                            <label className="form-label">Exclude Categories</label>
                            <select
                                multiple
                                name="excludeCategory"
                                className="form-input"
                                value={form.excludeCategory}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        excludeCategory: Array.from(e.target.selectedOptions, option => option.value)
                                    })
                                }
                            />
                        </div> */}

                        {/* Actions */}
                        <div className="form-actions">
                            <Button type="submit" className="btn-add" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Coupon'}
                            </Button>

                            <Button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate('/coupons')}
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

export default CouponForm;
