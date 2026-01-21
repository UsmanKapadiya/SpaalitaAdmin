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

const GiftCard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
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
    {
      id: '4',
      name: 'Steam Gift Card',
      code: 'STM-20',
      value: 20,
      qty: 40,
      description: 'Steam Wallet gift card for games.',
      createdAt: '2025-10-10',
      updatedAt: '2025-11-01',
    },
    {
      id: '5',
      name: 'Walmart Gift Card',
      code: 'WMT-50',
      value: 50,
      qty: 60,
      description: 'Walmart eGift Card for shopping.',
      createdAt: '2025-09-15',
      updatedAt: '2025-10-01',
    },
    {
      id: '6',
      name: 'Target Gift Card',
      code: 'TGT-25',
      value: 25,
      qty: 80,
      description: 'Target digital gift card for stores.',
      createdAt: '2025-08-20',
      updatedAt: '2025-09-01',
    },
    {
      id: '7',
      name: 'Best Buy Gift Card',
      code: 'BBY-100',
      value: 100,
      qty: 20,
      description: 'Best Buy eGift Card for electronics.',
      createdAt: '2025-07-10',
      updatedAt: '2025-08-01',
    },
    {
      id: '8',
      name: 'Uber Gift Card',
      code: 'UBR-50',
      value: 50,
      qty: 35,
      description: 'Uber digital gift card for rides.',
      createdAt: '2025-06-15',
      updatedAt: '2025-07-01',
    },
    {
      id: '9',
      name: 'Netflix Gift Card',
      code: 'NFLX-30',
      value: 30,
      qty: 45,
      description: 'Netflix eGift Card for streaming.',
      createdAt: '2025-05-20',
      updatedAt: '2025-06-01',
    },
    {
      id: '10',
      name: 'Spotify Gift Card',
      code: 'SPFY-60',
      value: 60,
      qty: 25,
      description: 'Spotify digital gift card for music.',
      createdAt: '2025-04-10',
      updatedAt: '2025-05-01',
    },
    {
      id: '11',
      name: 'Apple Store Gift Card',
      code: 'APL-200',
      value: 200,
      qty: 10,
      description: 'Apple Store eGift Card for devices.',
      createdAt: '2025-03-15',
      updatedAt: '2025-04-01',
    },
    {
      id: '12',
      name: 'PlayStation Gift Card',
      code: 'PSN-50',
      value: 50,
      qty: 70,
      description: 'PlayStation Network gift card for games.',
      createdAt: '2025-02-20',
      updatedAt: '2025-03-01',
    },
    {
      id: '13',
      name: 'Xbox Gift Card',
      code: 'XBX-25',
      value: 25,
      qty: 90,
      description: 'Xbox digital gift card for games.',
      createdAt: '2025-01-10',
      updatedAt: '2025-02-01',
    },
    {
      id: '14',
      name: 'Facebook Gift Card',
      code: 'FBK-10',
      value: 10,
      qty: 100,
      description: 'Facebook eGift Card for ads.',
      createdAt: '2024-12-15',
      updatedAt: '2025-01-01',
    },
    {
      id: '15',
      name: 'Disney+ Gift Card',
      code: 'DSNY-40',
      value: 40,
      qty: 55,
      description: 'Disney+ digital gift card for streaming.',
      createdAt: '2024-11-20',
      updatedAt: '2024-12-01',
    },
    {
      id: '16',
      name: 'eBay Gift Card',
      code: 'EBY-75',
      value: 75,
      qty: 30,
      description: 'eBay eGift Card for shopping.',
      createdAt: '2024-10-10',
      updatedAt: '2024-11-01',
    },
    {
      id: '17',
      name: 'Google Gift Card',
      code: 'GOGL-100',
      value: 100,
      qty: 60,
      description: 'Google eGift Card for services.',
      createdAt: '2024-09-15',
      updatedAt: '2024-10-01',
    },
    {
      id: '18',
      name: 'Amazon Prime Gift Card',
      code: 'AMZP-120',
      value: 120,
      qty: 20,
      description: 'Amazon Prime eGift Card for subscription.',
      createdAt: '2024-08-20',
      updatedAt: '2024-09-01',
    },
    {
      id: '19',
      name: 'Airbnb Gift Card',
      code: 'AIRB-150',
      value: 150,
      qty: 15,
      description: 'Airbnb digital gift card for stays.',
      createdAt: '2024-07-10',
      updatedAt: '2024-08-01',
    },
    {
      id: '20',
      name: 'Hulu Gift Card',
      code: 'HULU-30',
      value: 30,
      qty: 50,
      description: 'Hulu eGift Card for streaming.',
      createdAt: '2024-06-15',
      updatedAt: '2024-07-01',
    },
    {
      id: '21',
      name: 'DoorDash Gift Card',
      code: 'DRDS-25',
      value: 25,
      qty: 80,
      description: 'DoorDash digital gift card for food delivery.',
      createdAt: '2024-05-20',
      updatedAt: '2024-06-01',
    },
    {
      id: '22',
      name: 'Starbucks Gift Card',
      code: 'SBKS-15',
      value: 15,
      qty: 100,
      description: 'Starbucks eGift Card for coffee.',
      createdAt: '2024-04-10',
      updatedAt: '2024-05-01',
    },
    {
      id: '23',
      name: 'Visa Gift Card',
      code: 'VISA-200',
      value: 200,
      qty: 10,
      description: 'Visa digital gift card for payments.',
      createdAt: '2024-03-15',
      updatedAt: '2024-04-01',
    },
    {
      id: '24',
      name: 'Mastercard Gift Card',
      code: 'MCARD-100',
      value: 100,
      qty: 20,
      description: 'Mastercard eGift Card for payments.',
      createdAt: '2024-02-20',
      updatedAt: '2024-03-01',
    },
    {
      id: '25',
      name: 'Home Depot Gift Card',
      code: 'HDPT-75',
      value: 75,
      qty: 30,
      description: 'Home Depot digital gift card for home improvement.',
      createdAt: '2024-01-10',
      updatedAt: '2024-02-01',
    },
  ];

  const [giftCardData, setGiftCardData] = useState(allGiftCards);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [error] = useState(null);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }, []);

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
                { key: 'name', label: 'Name' },
                { key: 'code', label: 'Code' },
                { key: 'value', label: 'Value', render: value => `$${value}` },
                { key: 'qty', label: 'Qty' },
                { key: 'description', label: 'Description', render: value => value && value.length > 40 ? value.slice(0, 40) + '...' : value },
                { key: 'createdAt', label: 'Created', render: value => value ? dayjs(value).format('DD-MMM-YYYY') : '' },
                // { key: 'updatedAt', label: 'Updated', render: value => value ? dayjs(value).format('DD-MMM-YYYY') : '' },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (value, item) => (
                    <>
                      <Button className="btn-icon edit" onClick={e => handleEdit(item.id, e)} title={`Edit ${item.name}`} aria-label={`Edit ${item.name}`} variant="icon">
                        <EditIcon />
                      </Button>
                      <Button className="btn-icon delete" onClick={e => handleDelete(item.id, e)} title={`Delete ${item.name}`} aria-label={`Delete ${item.name}`} variant="danger">
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
