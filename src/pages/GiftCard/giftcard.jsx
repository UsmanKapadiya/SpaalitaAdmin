import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Button from '../../components/Button/Button';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import { useNavigate } from 'react-router-dom';
import GiftCardForm from './GiftCardForm';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EmptyState from '../../components/EmptyState/EmptyState';
import Pagination from '../../components/Pagination/Pagination';
import '../Product/product.css';
import GlobalLoader from '../../components/Loader/GlobalLoader';
import Table from '../../components/Table/Table';
import PageTitle from '../../components/PageTitle/PageTitle';
import { deleteGiftCard, getGiftCards } from '../../services/giftCardServices';
import ImageNotFound from '../../assets/download.png'

const GiftCard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [giftCardData, setGiftCardData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [error] = useState(null);
  // Fetch gift cards from API
  const fetchGiftCards = async () => {
    setLoading(true);
    const resp = await getGiftCards(page, itemsPerPage, searchTerm);
    if (resp && resp.data) {
      setGiftCardData(resp.data);
      if (resp.pagination) {
        setTotalItems(resp.pagination.total || resp.data.length);
        setTotalPages(resp.pagination.pages || 1);
      } else {
        setTotalItems(resp.data.length);
        setTotalPages(1);
      }
    } else {
      setGiftCardData([]);
      setTotalItems(0);
      setTotalPages(1);
      if (resp && resp.error) toast.error(resp.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGiftCards();
  }, [page, itemsPerPage, searchTerm]);

  const filteredGiftCards = giftCardData;

  // Edit gift card
  const handleEdit = useCallback((id, e) => {
    e.stopPropagation();
    navigate(`/giftCards/edit/${id}`);
  }, [navigate]);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null,
    itemName: ''
  });

  // Delete gift card
  const handleDelete = useCallback((id, e) => {
    e.stopPropagation();
    const item = giftCardData.find(item => item._id === id);
    setConfirmDialog({
      isOpen: true,
      itemId: id,
      itemName: item?.productName || item?.name || 'this gift card'
    });
  }, [giftCardData]);


  const confirmDelete = useCallback(async () => {
    if (!confirmDialog.itemId) return;
    const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
    try {
      const resp = await deleteGiftCard(confirmDialog.itemId, token);
      if (resp && resp.success === false) {
        throw new Error(resp.error || 'Delete failed');
      }
      toast.success('Gift Card deleted successfully!');
      setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
      fetchGiftCards(); // Refresh list
    } catch (err) {
      toast.error('Failed to delete Gift Card');
      setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    }
  }, [confirmDialog.itemId]);


  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, []);

  return (
    <DashboardLayout>
      <div className="news-page">
        <PageTitle
          title="Gift Cards"
          subTitle="Manage your gift card inventory."
          button={true}
          buttonLabel="Add Gift Card"
          onButtonClick={() => navigate('/giftCards/edit/new')}
        />

        <div className="search-bar">
          <SearchAndFilter
            searchValue={searchTerm}
            onSearchChange={value => {
              setSearchTerm(value);
              setPage(1);
            }}
            showFilter={false}
            placeholder="Search gift cards by name, code, or description..."
          />
        </div>
        <div className="product-table-wrapper order-list__table-container">
          {loading ? (
            <GlobalLoader text="Loading gift cards..." />
          ) : error ? (
            <div className="empty-state" > {error}</div>
          ) : filteredGiftCards.length > 0 ? (
            <Table
              tableClassName="product-table"
              columns={[
                {
                  key: 'productImages',
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
                { key: 'productName', label: 'Name' },
                { key: 'sku', label: 'Code' },
                { key: 'price', label: 'Value', render: value => `$${value}` },
                { key: 'qty', label: 'Qty' },
                {
                  key: 'description', label: 'Description',
                  render: (value) => {
                    if (!value) return '';
                    const plain = value.replace(/<[^>]+>/g, '');
                    return plain.length > 40 ? plain.slice(0, 40) + '...' : plain;
                  }
                },
                { key: 'createdAt', label: 'Created', render: value => value ? dayjs(value).format('DD-MMM-YYYY') : '' },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (value, item) => (
                    <>
                      <Button className="btn-icon edit" onClick={e => handleEdit(item._id, e)} title={`Edit ${item.name}`} aria-label={`Edit ${item.name}`} variant="icon">
                        <EditIcon />
                      </Button>
                      <Button className="btn-icon delete" onClick={e => handleDelete(item._id || item.id, e)} title={`Delete ${item.productName || item.name}`} aria-label={`Delete ${item.productName || item.name}`} variant="danger">
                        <DeleteIcon />
                      </Button>
                    </>
                  )
                }
              ]}
              data={filteredGiftCards}
            />
          ) : (
            <EmptyState
              icon={<CardGiftcardIcon style={{ fontSize: 48 }} />}
              title="No Gift Cards Found"
              description={searchTerm ? 'No gift cards found' : 'No gift cards yet'}
            />
          )}
        </div>
        {totalPages > 1 && !loading && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            showInfo={true}
            showJumper={totalPages > 10}
          />
        )}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={closeConfirmDialog}
          onConfirm={confirmDelete}
          title="Delete Gift Card"
          message={`Are you sure you want to delete "${confirmDialog.itemName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </DashboardLayout >
  );
};

export default GiftCard;
