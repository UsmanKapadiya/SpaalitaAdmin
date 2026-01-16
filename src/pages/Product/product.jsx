import React, { useState, useMemo, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductForm from './ProductForm';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Button from '../../components/Button';
import ArticleIcon from '@mui/icons-material/Article';
import Pagination from '@mui/material/Pagination';
import './product.css';
import GlobalLoader from '../../components/Loader/GlobalLoader';

const Product = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  // Simulated paginated API response for products
  const allProducts = [
    {
      id: '1',
      name: 'Wireless Mouse',
      price: 25.99,
      sku: 'WM-001',
      qty: 120,
      description: 'A high-precision wireless mouse with ergonomic design.',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-10',
    },
    {
      id: '2',
      name: 'Mechanical Keyboard',
      price: 79.99,
      sku: 'MK-002',
      qty: 60,
      description: 'RGB backlit mechanical keyboard with blue switches.',
      createdAt: '2025-12-15',
      updatedAt: '2026-01-05',
    },
    {
      id: '3',
      name: 'HD Monitor',
      price: 199.99,
      sku: 'HDM-003',
      qty: 30,
      description: '24-inch Full HD monitor with ultra-thin bezels.',
      createdAt: '2025-11-20',
      updatedAt: '2025-12-01',
    },
    // Add more products for pagination demo
    {
      id: '4',
      name: 'USB-C Hub',
      price: 49.99,
      sku: 'USBC-004',
      qty: 80,
      description: 'Multiport USB-C hub with HDMI and Ethernet.',
      createdAt: '2025-10-10',
      updatedAt: '2025-11-01',
    },
    {
      id: '5',
      name: 'Webcam',
      price: 59.99,
      sku: 'WEB-005',
      qty: 45,
      description: '1080p HD webcam with built-in microphone.',
      createdAt: '2025-09-05',
      updatedAt: '2025-09-20',
    },
    {
      id: '6',
      name: 'Bluetooth Speaker',
      price: 39.99,
      sku: 'BTS-006',
      qty: 100,
      description: 'Portable Bluetooth speaker with deep bass.',
      createdAt: '2025-08-15',
      updatedAt: '2025-08-30',
    },
    {
      id: '7',
      name: 'Laptop Stand',
      price: 29.99,
      sku: 'LS-007',
      qty: 70,
      description: 'Adjustable aluminum laptop stand.',
      createdAt: '2025-07-10',
      updatedAt: '2025-07-25',
    },
    {
      id: '8',
      name: 'External SSD',
      price: 129.99,
      sku: 'SSD-008',
      qty: 25,
      description: '1TB USB 3.1 external solid state drive.',
      createdAt: '2025-06-01',
      updatedAt: '2025-06-15',
    },
    {
      id: '9',
      name: 'Gaming Chair',
      price: 249.99,
      sku: 'GC-009',
      qty: 15,
      description: 'Ergonomic gaming chair with lumbar support.',
      createdAt: '2025-05-20',
      updatedAt: '2025-06-01',
    },
    {
      id: '10',
      name: 'Smartwatch',
      price: 199.99,
      sku: 'SW-010',
      qty: 40,
      description: 'Fitness tracking smartwatch with heart rate monitor.',
      createdAt: '2025-04-10',
      updatedAt: '2025-04-25',
    },
    {
      id: '11',
      name: 'Noise Cancelling Headphones',
      price: 149.99,
      sku: 'NCH-011',
      qty: 35,
      description: 'Wireless headphones with active noise cancellation.',
      createdAt: '2025-03-01',
      updatedAt: '2025-03-15',
    },
    {
      id: '12',
      name: 'Tablet',
      price: 299.99,
      sku: 'TAB-012',
      qty: 22,
      description: '10-inch Android tablet with 64GB storage.',
      createdAt: '2025-02-10',
      updatedAt: '2025-02-25',
    },
  ];

  const [productData, setProductData] = useState(allProducts);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [loading] = useState(false);
  const [error] = useState(null);

  // Filter and paginate products
  const filteredProducts = useMemo(() => {
    let filtered = productData;
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = productData.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)
      );
    }
    const startIdx = (page - 1) * itemsPerPage;
    return filtered.slice(startIdx, startIdx + itemsPerPage);
  }, [searchTerm, productData, page]);

  const totalItems = useMemo(() => {
    if (!searchTerm.trim()) return productData.length;
    const search = searchTerm.toLowerCase();
    return productData.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.sku.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    ).length;
  }, [searchTerm, productData]);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset to page 1 when search changes
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Edit product
  const handleEdit = useCallback((id, e) => {
    e.stopPropagation();
    navigate(`/products/edit/${id}`);
  }, [navigate]);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null,
    itemName: ''
  });

  // Delete product
  const handleDelete = useCallback((id, e) => {
    e.stopPropagation();
    const item = productData.find(item => item.id === id);
    setConfirmDialog({
      isOpen: true,
      itemId: id,
      itemName: item?.name || 'this product'
    });
  }, [productData]);

  const confirmDelete = useCallback(() => {
    if (!confirmDialog.itemId) return;
    setProductData(prev => prev.filter(item => item.id !== confirmDialog.itemId));
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    toast.success('Product deleted successfully!');
  }, [confirmDialog.itemId]);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout>
            <div className="product-page">
              <div className="page-header">
                <div className="product-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h1 className="page-title">Products</h1>
                    <p className="page-subtitle">Manage your product inventory</p>
                  </div>
                  <div className="product-actions" style={{ marginLeft: 'auto' }}>
                    <Button className="btn-add" onClick={() => navigate('/products/edit/new')}>
                      <AddIcon style={{ marginRight: 6 }} />
                      Add Product
                    </Button>
                  </div>
                </div>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search products by name, SKU, or description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchTerm && (
                  <Button
                    className="clear-search"
                    onClick={() => {
                      setSearchTerm('');
                      setPage(1);
                    }}
                    aria-label="Clear search"
                    // variant="secondary"
                  >
                    ×
                  </Button>
                )}
              </div>

              <div className="product-table-wrapper">
                {loading && <GlobalLoader text="Loading..." />}
                {error ? (
                  <div className="empty-state">{error}</div>
                ) : filteredProducts.length > 0 ? (
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Description</th>
                        <th>Created</th>                      
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.sku}</td>
                          <td>${item.price}</td>
                          <td>{item.qty}</td>
                          <td>{item.description && item.description.length > 40 ? item.description.slice(0, 40) + '...' : item.description}</td>
                          <td>{item.createdAt ? dayjs(item.createdAt).format('DD-MMM-YYYY') : ''}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                              <Button className="btn-icon edit" onClick={e => handleEdit(item.id, e)} title={`Edit ${item.name}`} aria-label={`Edit ${item.name}`} variant="secondary" style={{padding: 4, minWidth: 0, height: 32}}>
                                <EditIcon />
                              </Button>
                              <Button className="btn-icon delete" onClick={e => handleDelete(item.id, e)} title={`Delete ${item.name}`} aria-label={`Delete ${item.name}`} variant="danger" style={{padding: 4, minWidth: 0, height: 32}}>
                                <DeleteIcon />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon"><ArticleIcon style={{ fontSize: 48 }} /></div>
                    <div className="empty-state-text">
                      {searchTerm ? 'No products found' : 'No products yet'}
                    </div>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="pagination-container">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </div>
              )}

              <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={closeConfirmDialog}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${confirmDialog.itemName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
              />
            </div>
          </DashboardLayout>
        }
      />
      <Route
        path="/edit/:id"
        element={<ProductForm products={productData} setProducts={setProductData} />}
      />
      <Route
        path="/edit/new"
        element={<ProductForm products={productData} setProducts={setProductData} />}
      />
    </Routes>
  );
};

export default Product;
