import React, { useState, useMemo, useCallback } from 'react';
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
import Pagination from '@mui/material/Pagination';
import '../Product/product.css';
import GlobalLoader from '../../components/Loader/GlobalLoader';

const GiftCard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  // Simulated paginated API response for gift cards
  const allGiftCards = [
    {
      id: '1',
      name: 'Amazon Gift Card',
      code: 'AMZ-100',
      value: 100,
      qty: 50,
      description: 'Amazon eGift Card, redeemable online.',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-10',
    },
    {
      id: '2',
      name: 'iTunes Gift Card',
      code: 'ITN-50',
      value: 50,
      qty: 30,
      description: 'iTunes digital gift card for music and apps.',
      createdAt: '2025-12-15',
      updatedAt: '2026-01-05',
    },
    {
      id: '3',
      name: 'Google Play Gift Card',
      code: 'GPL-25',
      value: 25,
      qty: 100,
      description: 'Google Play Store gift card for apps and games.',
      createdAt: '2025-11-20',
      updatedAt: '2025-12-01',
    },
  ];

  const [giftCardData, setGiftCardData] = useState(allGiftCards);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [loading] = useState(false);
  const [error] = useState(null);

  // Filter and paginate gift cards
  const filteredGiftCards = useMemo(() => {
    let filtered = giftCardData;
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = giftCardData.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.code.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)
      );
    }
    const startIdx = (page - 1) * itemsPerPage;
    return filtered.slice(startIdx, startIdx + itemsPerPage);
  }, [searchTerm, giftCardData, page]);

  const totalItems = useMemo(() => {
    if (!searchTerm.trim()) return giftCardData.length;
    const search = searchTerm.toLowerCase();
    return giftCardData.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    ).length;
  }, [searchTerm, giftCardData]);
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
    const item = giftCardData.find(item => item.id === id);
    setConfirmDialog({
      isOpen: true,
      itemId: id,
      itemName: item?.name || 'this gift card'
    });
  }, [giftCardData]);

  const confirmDelete = useCallback(() => {
    if (!confirmDialog.itemId) return;
    setGiftCardData(prev => prev.filter(item => item.id !== confirmDialog.itemId));
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    toast.success('Gift Card deleted successfully!');
  }, [confirmDialog.itemId]);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, []);

  return (
    <DashboardLayout>
      <div className="product-page">
        <div className="page-header">
          <div className="product-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 className="page-title">Gift Cards</h1>
              <p className="page-subtitle">Manage your gift card inventory</p>
            </div>
            <div className="product-actions" style={{ marginLeft: 'auto' }}>
              <button className="btn-add" onClick={() => navigate('/giftCards/edit/new')}>
                <AddIcon />
                Add Gift Card
              </button>
            </div>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search gift cards by name, code, or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="product-table-wrapper">
          {loading && <GlobalLoader text="Loading..." />}
          {error ? (
            <div className="empty-state">{error}</div>
          ) : filteredGiftCards.length > 0 ? (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Value</th>
                  <th>Qty</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGiftCards.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.code}</td>
                    <td>${item.value}</td>
                    <td>{item.qty}</td>
                    <td>{item.description}</td>
                    <td>{item.createdAt ? dayjs(item.createdAt).format('DD-MMM-YYYY') : ''}</td>
                    <td>{item.updatedAt ? dayjs(item.updatedAt).format('DD-MMM-YYYY') : ''}</td>
                    <td>
                      <button className="btn-icon edit" onClick={e => handleEdit(item.id, e)} title="Edit" aria-label={`Edit ${item.name}`}>
                        <EditIcon />
                      </button>
                      <button className="btn-icon delete" onClick={e => handleDelete(item.id, e)} title="Delete" aria-label={`Delete ${item.name}`}>
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><ArticleIcon style={{ fontSize: 48 }} /></div>
              <div className="empty-state-text">
                {searchTerm ? 'No gift cards found' : 'No gift cards yet'}
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
          title="Delete Gift Card"
          message={`Are you sure you want to delete "${confirmDialog.itemName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </DashboardLayout>
  );
};

export default GiftCard;
