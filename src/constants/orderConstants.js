// Order status constants
export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  ON_HOLD: 'On hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
  FAILED: 'Failed'
};

// Payment method constants
export const PAYMENT_METHODS = {
  ONLINE: 'Online Payment',
  COD: 'Cash On Delivery',
  CARD: 'Credit Card',
  BANK_TRANSFER: 'Bank Transfer'
};

// Order validation rules
export const VALIDATION_RULES = {
  customerName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    required: true,
    pattern: /^[\+]?[1-9][\d]{0,15}$/
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 200
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  zip: {
    required: true,
    pattern: /^[0-9]{5,10}$/
  }
};

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// Table column configurations
export const ORDER_TABLE_COLUMNS = [
  { key: 'orderId', label: 'Order ID', sortable: true, width: '10%' },
  { key: 'customerName', label: 'Customer', sortable: true, width: '20%' },
  { key: 'items', label: 'Items', sortable: false, width: '25%' },
  { key: 'total', label: 'Total', sortable: true, width: '15%' },
  { key: 'status', label: 'Status', sortable: true, width: '15%' },
  { key: 'createdAt', label: 'Date', sortable: true, width: '10%' },
  { key: 'actions', label: 'Actions', sortable: false, width: '5%' }
];

// Default form values
export const DEFAULT_ORDER = {
  customerName: '',
  items: [],
  total: 0,
  status: ORDER_STATUS.PENDING,
  paymentOption: PAYMENT_METHODS.ONLINE,
  shippingPrice: 0,
  billingAddress: {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: '',
    phone: ''
  },
  shippingAddress: {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: '',
    phone: ''
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Status color mapping for UI
export const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: { bg: '#fff3cd', text: '#856404', border: '#ffeaa7' },
  [ORDER_STATUS.PROCESSING]: { bg: '#cce5ff', text: '#004085', border: '#74b9ff' },
  [ORDER_STATUS.ON_HOLD]: { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' },
  [ORDER_STATUS.COMPLETED]: { bg: '#d4edda', text: '#155724', border: '#00b894' },
  [ORDER_STATUS.CANCELLED]: { bg: '#f8d7da', text: '#721c24', border: '#e17055' },
  [ORDER_STATUS.REFUNDED]: { bg: '#d1ecf1', text: '#0c5460', border: '#74b9ff' },
  [ORDER_STATUS.FAILED]: { bg: '#f8d7da', text: '#721c24', border: '#e17055' }
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_ZIP: 'Please enter a valid ZIP code',
  MIN_LENGTH: (min) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max) => `Maximum ${max} characters allowed`,
  ORDER_NOT_FOUND: 'Order not found',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred'
};