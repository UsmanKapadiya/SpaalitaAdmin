import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../services/productService';
import { getCategorys } from '../../services/categoryServices';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '../../components/Button/Button';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmptyState from '../../components/EmptyState/EmptyState';
import Pagination from '../../components/Pagination/Pagination';
import './product.css';
import GlobalLoader from '../../components/Loader/GlobalLoader';
import Table from '../../components/Table/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ProductDetails from './ProductDetails';
import PageTitle from '../../components/PageTitle/PageTitle';
import ImageNotFound from '../../assets/download.png'

const Product = () => {
  const navigate = useNavigate();
  const [viewProductId, setViewProductId] = useState(null);
  const handleView = useCallback((product, e) => {
    e.stopPropagation();
    setViewProductId(product.id);
  }, []);
  const handleBackFromView = useCallback(() => setViewProductId(null), []);
  const handleEditFromView = useCallback((id) => navigate(`/products/edit/${id}`), [navigate]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');


  useEffect(() => {
    const fetchData = async () => {
      const catResp = await getCategorys();
      let catData = [];
      if (catResp?.success) {
        setCategories(catResp.data);
        catData = catResp.data;
      }

      const resp = await getProducts(page, itemsPerPage, searchTerm);
      let products = [];
      if (resp?.success && Array.isArray(resp.data)) {
        products = resp.data.map(item => {
          const productCategories = (item.categories || []).map(catId => {
            // Find parent
            const parent = catData.find(c => c._id === catId);
            if (parent) return { _id: parent._id, name: parent.name };

            // Search children
            for (const c of catData) {
              const child = c.children?.find(ch => ch._id === catId);
              if (child) return { _id: child._id, name: child.name };
            }

            return null; // skip unknown
          }).filter(Boolean);

          return {
            id: item._id,
            name: item.productName,
            sku: item.sku,
            price: item.price,
            qty: item.qty,
            images: item.productImages,
            description: item.description,
            categories: productCategories,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        });
        if (resp && resp.pagination) {
          setPagination(resp.pagination);
          setPage(resp.pagination.page);
          setItemsPerPage(resp.pagination.limit);
        }
      }
      setLoading(false);
      setProductData(products);
    };

    fetchData();
  }, [page, searchTerm, itemsPerPage]);



  const filteredProducts = productData;
  const totalPages = pagination.pages;

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

  const confirmDelete = useCallback(async () => {
    if (!confirmDialog.itemId) return;
    try {
      await deleteProduct(confirmDialog.itemId, token);
      toast.success('Product deleted successfully!');
      setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
      // getAllProducts(page, searchTerm); // Refresh list
    } catch (err) {
      toast.error('Failed to delete product');
      setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    }
  }, [confirmDialog.itemId, page, searchTerm]); //getAllProducts

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, []);

  if (viewProductId) {
    const product = productData.find(p => p.id === viewProductId);
    return (
      <ProductDetails
        product={product}
        onBack={handleBackFromView}
        onEditProduct={handleEditFromView}
      />
    );
  }
  console.log(categories);
  return (
    <DashboardLayout>
      <div className="news-page">
        <PageTitle
          title="Products"
          subTitle="Manage your product inventory."
          button={true}
          buttonLabel="Add Product"
          onButtonClick={() => navigate('/products/edit/new')}
        />
        <div className="search-bar">
          <SearchAndFilter
            searchValue={searchTerm}
            onSearchChange={value => {
              setSearchTerm(value);
              setPage(1);
            }}
            showFilter={false}
            placeholder="Search products by Name or SKU..."
          />
        </div>

        <div className="product-table-wrapper order-list__table-container">
          {loading ? (
            <GlobalLoader text="Loading products..." />
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : filteredProducts.length > 0 ? (
            <Table
              tableClassName="product-table"
              columns={[
                {
                  key: 'images',
                  label: 'Image',
                  render: (value) => {
                    const imgSrc = Array.isArray(value) && value.length > 0
                      ? value[0]
                      : ImageNotFound;
                    return (
                      <img
                        src={imgSrc}
                        alt="Product"
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                        onError={e => { e.target.src = ImageNotFound; }}
                      />
                    );
                  },
                },
                {
                  key: 'name',
                  label: 'Name',
                  render: (value) => value && value.length > 20 ? value.slice(0, 20) + '...' : value,
                },
                {
                  key: 'sku',
                  label: 'SKU',
                },
                {
                  key: 'price',
                  label: 'Price',
                  render: (value) => `$${value}`,
                },
                {
                  key: 'qty',
                  label: 'Qty',
                  render: (value) => {
                    const qty = Number(value) || 0;
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{qty}</span>
                        {qty < 10 && (
                          <span
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: 4,
                              fontSize: '0.75rem',
                              fontWeight: 500,
                            }}
                          >
                            Low
                          </span>
                        )}
                      </div>
                    );
                  },
                },
                {
                  key: 'categories',
                  label: 'Category',
                  render: (productCategories) => {
                    if (!Array.isArray(productCategories) || productCategories.length === 0) return '-';
                    return productCategories.map(cat => cat.name).join(', ');
                  },
                },
                {
                  key: 'createdAt',
                  label: 'Created',
                  render: (value) => value ? dayjs(value).format('DD-MMM-YYYY') : '',
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (value, item) => (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                      <Button
                        className="btn-icon view"
                        onClick={e => handleView(item, e)}
                        title={`View ${item.name}`}
                        aria-label={`View ${item.name}`}
                        variant="info"
                        style={{ padding: 4, minWidth: 0, height: 32 }}
                      >
                        <VisibilityIcon />
                      </Button>
                      <Button className="btn-icon edit" onClick={e => handleEdit(item.id, e)} title={`Edit ${item.name}`} aria-label={`Edit ${item.name}`} variant="secondary" style={{ padding: 4, minWidth: 0, height: 32 }}>
                        <EditIcon />
                      </Button>
                      <Button className="btn-icon delete" onClick={e => handleDelete(item.id, e)} title={`Delete ${item.name}`} aria-label={`Delete ${item.name}`} variant="danger" style={{ padding: 4, minWidth: 0, height: 32 }}>
                        <DeleteIcon />
                      </Button>
                    </div>
                  ),
                },
              ]}
              data={filteredProducts}
            />
          ) : (
            <EmptyState
              icon={<LocalOfferIcon style={{ fontSize: 48 }} />}
              title="No Products Found"
              description={searchTerm ? 'No products found' : 'No products yet'}
            />
          )}
        </div>

        {totalPages > 1 && !loading && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            showInfo={true}
            showJumper={totalPages > 10}
          />
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
  );
};

export default Product;
