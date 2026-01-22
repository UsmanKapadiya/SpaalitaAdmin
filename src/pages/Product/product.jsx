import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
      images: [
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhMVFRUVFxUVFRcVFRUVFRUXFxcWFxcVFRcYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFQ8PFS0dFR0rLS0tLS0tLS0tKy0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tKy0rLS0tLS0tLS0rLS0tLf/AABEIANIA8AMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAADAAECBAUGB//EAEQQAAICAQEFBAcDBwoHAAAAAAECAAMRBAUSITFBUWFxgQYTIjJSkaFCcsEHIzNigrHRFBVDU5KiwtLw8RZjg5Ojw+H/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAGhEBAQEAAwEAAAAAAAAAAAAAAAERAhIxUf/aAAwDAQACEQMRAD8A9KFUf1Ut7kcVzprOKy1SXqpZWuS3I0xXWuS9XLASPuSKAtcmEhlSPuxoEEkgkIFj7sCG7HCyYEcCQRxHxJYjQpsRSe7EEk0xDMW9J4jESaIb/dF63uMkZAxocWjtkwwPIwDCAcRovmNM/wDlDL1+fGTr2gPtDHfzl0XTGkUcNxBB8JKUKRMeRaUQMi0mZBhKHCx92TxFiREQsfdkhHxIIhY4ElFAbEeKPiFNiPHxFAaKKSAk0MFksRiYxaRU8yOZAtGLyCRaRLSDNBs8AheQZ4FngnsgGayBeyBe2VrLoFiyyVLLRAW3ypZdAurqipyCR4TT0W2Fb2X4Ht6Hx7Jy73wLaiJTHocYzkNjbe9WQr8U+q+Hd3TrVYEAjiDxBE3KhjImTMg00C4jxRTKHiiihSjxRQFHjRMwAyeQgPG5zOt2xWvvCwDt9W+PniS022tO/BLUJ7M4PyMzaNCMWgzaIJrZAUvG35VsvAGSQAOZPADzmZ/PO/wore7plQFrz2esbA+UK2y8G1k57W7ZuqKh6Ml2CqqWK7knsUDj+EvaLaK2rvLngSGDAhlI5qwPEGBfayDayBZ4NngGayBd4NrJXstgEttlK26QuulK26AS26VLLoKy2AayQFa2CayBeyBayFHNs6j0R2vx9S54H3D2Hs8D+/xnGGyF0txVgRwwZYj1syJEBs7U+tqSz4hx8eR+oMOZ0QWPIxxIh4oooUsx40WYDkyGc+EiTnwiLTNomWlLW6auz9JWj/eUE+RPESb2QLPIM9tjqvGmyyk9gYunmj8fkRBNbqq/eRLh2odx/Fkb/CTNMvOU9JPSjczVSctyZug8IVY1moRfb1rBm5rQhyi/f+NvHh4wVvphgEisKijqeOB0AE5GlGdt5iSTzJm5sLZxutBxlKmGOx7RxHknA+JXsMg39koxJutH55hxB/olPKtew/Ee3hyGTS0+qxtK6scm01drffFhrBPeVwP2Z0OvqFNQzz4k+U5H0VcWtfrCRm9lSvBziqneAJ7Mu1nkqnrKjpmsg2sgmeDd4VOyyVbbZG2yU7rZArrpTssjWWSrZZAlZbAWXQNlsAzQozWwZaRWFSuBEQtQk0ple/aNVZ3c7z/AntN+10XzImoj0j0PszQR8LH6gH+M3DMD0NDDSozgA2ZfA6A8FGevAA+c3d6dEFkhGiEyh48aKA4MC758I1tnT5wZaZtUQvAWWSL2Su7yCbPIF4JnmF6SbZ9Sm6p9tuA7u+BW9KvSArmmo+19ojoP4zk6KsmU7NX7e4qvdaeJRBkjP2nY4VB3sR5x3OvXiq6RO1bHtdgewlABmJDXQ6XTMxWtPffkcZ3FHvOR2D6kqOs9J2HstKK1AGAowAefbxPViSST2kmcJ+TDaJttvTUIq3IFcMjbyNX7oVM8Rhjkg8y47Bjttr7QwuBwLch2L1J7zy+cvgp7V1u+5IPAcB5dZjXaKtjvAbjc96v2Wz2nHBvMGEZ5AvIAtbanMC1e1Bu2DxT7Xkc90VeuR/dbJHMciO4g8pJ7ZQ1lSvxYcRyYHDDwPXwOR3SKsW2ynbZK1llie9+cXtA9sfeXr4jzxIi8MMqQR2iA9rylbZJ22SuxzCokyddRMJTTnieQ4knkB2zL1+3fs6flyNpGf+2pGD948OwEcYxGpfZXUA1rhQeWebdyqOLHuAmbft4nhTV+3bw8xWvE+ZUzIC+0WJLMebMSzHzPHHHlyEKJrE0S22y39JYzD4V9hPDdXmO5iZd2ToA7pUoxkgYAwAOpx3c5URp0HosQHL9nAefM/L981EemadwFCjgFAAHYAMCWUsnP6bVZmjVfNK3YhFiPiZQoG+3HAc5O590Zme1nWS0FLQT2Qb2Su9syCvZAPbBPbAs8KbX60VoXboJ51qbrNVcVU4J4u+M+qQ8go6ueOB4k9AdD0x2uSdxPawQqr8djcFHh1J7AT0mcxFFXqgd5uLWcAXdyPad6bVBYdBungAB0lk1LRrL69OhrqAUDi+S+8Seb25Cvk9WKuPKYWs2rnmcDoOHLy4Y+77J5jdMy9o7SyeB4D3cFsA9q5O9We1eIkPR7ZT63ULQmRn2rGGMJWPePZnoO89mZrWXp/wCS3T4pt1jjCuQlY7VQnJH3mOP+mTNzUXlmLHmfp3CM5VESmoBa6wFUDlgDH7gB/oys7TFbiZeQeyCLwT2Qp7LJXZ4ztBM0BPZKGprBJZTut1+FvvD8Rx8Ya15VdpANbsndIww5j8QeolimsY3icAAkk8gBxJMjVTvkDqOR7D/DumBtrbPrB6tAQgPtE49tgccMfZyMjt59BLIFtfaptO6uRUOQ5FyPtP3di/Pjyob8rF5BrZWV310Y6iZxugmujRrDV8cDrOl2XZuqB8/HrOc2Roz77eXd/wDZuUcI1Y63QaqbGn1E5PQ2Tf0ls3GnoAjxoHW2bqE+XzkYUNZqMt3CVWulZ7YJnmRYe6AeyCZ4JnkUUvKm0dVuVs3dwky0zttAsmO0iBxIYtqcnJFSb/u7/t2EjeK5G8AqkYHH85Mnbe0N7gMFegyXTxUt7dfhLu30NFrMwO7YqlWKnd3kyrAOOKMPZOeXtTn9PprtVbuUo1j9cdM9XccAO8zU8ZvqmqPa61opd3IVQOJYn/XM8gDPZPRbYS6CjcyDdZhrn7+iL+qP49plb0T9FU0C77kPqWGGYcqx8CZ+p5nu5DZd5Ksh2aCZozNAs0ind4FmiZ4FnhTM0FY0kTK9ryAVrwS8TGY8YevdVWsfgqAsx7h+MClt3X+oq3FP5ywEDHNV5Fu49B5npOOz9IfaOta6xrG5k8Bz3VHAKPAfXJ6ylY80zUmsgHskGeDGWOBAlv5mvsrZuTvMPCT2VsvkW5zoKqwOUi4SV4EmnOIyaCVWhpZt6R5iaaa+kmosenzL2/bhFHaSfl/vNSYnpgCNObRkilhawGc+rAK2HA57qsz467ghhietkWslRreoOQeo4g94MYWzIsM8gXgS8iWkUbfkLCMe1yHE9wHWQ3oFzvtu/ZTDP3n7CeZBJ7lI6wNvZ9elO7Zeobd41VMm8FypBscHgXIJH6oJHPMfV7Sr5UVLUP1QAfkvATHazPOR34BWeQLSBeQZoDs8EzRnaCZoDs0GTGJkGaFNY0q2tJu8r85BOpMmZHpbr+WnU8sNZ481Xy97zXsmxqtUNPU1p4kcEB+0x5D8T3AzgrbCxLMSWJJJPUniSfMyxKi5laxpOx4+k0bWHulQCmlnOBOk2ZssKMkcZa0GhCCXgJFwyriTEaSAhSUQ1axlWHrWWCzpxNTTCUKFmlp1m4PTBEQOR456Roswy8k2xUdl3epsz/JHJOnsPH1IJ/QufgBOA32QRngeF7encbf0Feppaq0ZB5Hqp6EfOeO3Lfs2w14N2n6IPeQdtJPMfqHyxJYmus3ot6U9n7QrvTfqcOvI45qfhZTxU9xlgmZVK24KCx6DMhUpRcH3iSz/AHjjI8gAv7OesgTlgOi+2fEe6Pnx8FMdmkVLei3oPMYmBMtIF5EtBloEmaQJkS0iWgOTBO0TNAu0ioO0JpasmCRcmUPSbafqU9Qh/OWD2yDxRD/ibiB3ZPZAyPSPagus3UOa68hccmP2n8+Q7hnrMaxogYbRaQ2H9X980ybQ6E2HPSdNpNKFHCPpqAowIeFhCOIo6iRSUQqLEiw6LASJLFSSKLLVSzciDUrL9CyvSkv0LLFd8TBW2STGVrnlYU9dccTjNvViwEEZ/CdRrmnP65czUZrzrW6F6rPWVM1b8g6de5geDDuM6rZGvd6Ve0Ak5DNWDgEEjDIckcMHhnn2QevpUZ3iB44nOW7XOmLClx7WCQ6krkdQN4HOOHy7JnlFldlpmDBmUg+1gkHoAMZ78s3zjss5jZvpTp7mxcPUWchYp9k+Ljl4MMd8tbW9I20torsrNqFQwdcK3Eke77rDh0xOeNNoyJlPQekGlv4Jaob4LPzb/JpptQYVVJkCYdqoJkkAi0gTCFJApIoTtB4yZYGnJmVtrb1Wmyi4tu+AHgnfaw93w5nu5wLG1dorpa944axsitPiI6nsUdT5czOEtuZmZ2O8zHeYnmT/AK4AdAAI2p1TWubLG3nbmeQ4clUdFHZ/vFRUXYKP9ppm3RtJpi5wOXWdLpNOEGBBbP0gQYl4CRZCiiAk1WFMqwyrHRIVEgJEhUWOiw6JNQPWkt1VyFaS3Qk0gtNcvVJB1Vy1WsquKX8qt3UD+yv4CM35Un7P7om835KNH0v1HmaT/wCuCb8lGl/r7/8Axf5Ixhy+p/KRa3Jfov8ACZGq9Mr37vn+6d4PyZ6Neb3t4vWB/dQRf8GaJOVO9953P03sfSXrfqa8r1G07n5tjPZwhNNsPUW8QjAfE/sj68T5Az1JdnVVfo660+6qqfMjjKtxjqa4yr0UCj223j2Dgo/E/SVddobFVa85RM7g6qDjIB544cuU7J2ErWoDJYSvP7KweBAPcRCae+2vjVfbX3LY275qTgzp9bstG7Jj6nY5HumZqjaf0t1qc2puH/MTdbHYDWR9ZqVenIx+c0rg9fV2Kw8g2DOWt09i8x8pXa7HMESGu1Ppvp/6jUf2a/8APK2o9Oh/R6Vie2yxVHyUHM5BrpA2SLrW2h6Saq4YLipD9mkFM+LnLfUCZCAAYHARt+WtLo2fpgQI0oWOBOk2ZoQg74+ztAFE0lWRcOqx8R5JFhTKsOixIkOqyiKrDIkkiQ6JLgiiSzXXHrrlqqqVEa6pdppj11S1WkoetIdFiRYdFlFA7YMg22DLLbKkG2TLjOqNu1SekoXa1j0m0dkwbbK7ow1zdtjnpKtlbGdS+zYCzQRiOWbTtIGgzorNFK1mkkwYnqTBPpzNh6IM1Ri6w7NNKV2hB6TpjTBPpZm8TXJvslT0EH/My9k6d9HBHTd0zisWnZSjoJpU6YCWRVJASKgFksSWJJEgRVYdEk0rh0rlkEESHSuTSuWEqmsA0rliuqFrplmumUDrpluuqTrqh0SBFEh1SSRIdUlDIkMqx0WEVZSL/qhEahD7sWJGVY0QbUCXMRt2Bmvp5Vs002GWCeqVGBbpJSt0s6WyiVbNNKOZt0sqvpZ01ullR9LCOdOnkDVN19LK7aaFZBpkDp5rNp5E0SYMhtJBnRTb9RHFEnVdYg0UIujmyKJMUR1NZKaaHTTzSXTwy6eMXWelEsJRLy6eGSiBUrplhKpYWmFWmBXWuHSuGWqECQBqkKFklSEVIEQsmokwskFlVfMiYopGaUiYooDSJiilRBhK9keKIVXeAsEeKWCrYOcAwiigAcQTCKKEMRFFFCpAQqiNFAKghkEaKRRVEOkUUKmokhFFIJrJCKKFTEIIooRIRCKKVX//2Q==',
        'data:image/jpeg;base64,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',
      ],
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
      images: [
        'https://via.placeholder.com/64x64?text=Keyboard1',
        'https://via.placeholder.com/64x64?text=Keyboard2',
        'https://via.placeholder.com/64x64?text=Keyboard3',
      ],
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
      images: [
        'https://via.placeholder.com/64x64?text=Monitor1',
      ],
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
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }, []);
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

  if (viewProductId) {
    const product = productData.find(p => p.id === viewProductId);
    console.log(product)
    return (
      <ProductDetails
        product={product}
        onBack={handleBackFromView}
        onEditProduct={handleEditFromView}
      />
    );
  }

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
            placeholder="Search products by name, SKU, or description..."
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
                  key: 'name',
                  label: 'Name',
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
                },
                {
                  key: 'description',
                  label: 'Description',
                  render: (value) => value && value.length > 40 ? value.slice(0, 40) + '...' : value,
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
            onPageChange={(newPage) => handlePageChange(null, newPage)}
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
