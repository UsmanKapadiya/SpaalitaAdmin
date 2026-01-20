// Order Status Constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Order Status Options for Filters and Dropdowns
export const ORDER_STATUS_OPTIONS = [
  { value: ORDER_STATUS.PENDING, label: 'Pending Payment' },
  { value: 'processing', label: 'Processing' },
  { value: 'on-hold', label: 'On hold' },
  { value: ORDER_STATUS.SHIPPED, label: 'Shipped' },
  { value: ORDER_STATUS.DELIVERED, label: 'Completed' },
  { value: ORDER_STATUS.CANCELLED, label: 'Cancelled' },
  { value: 'refund', label: 'Refund' },
  { value: 'failed', label: 'Failed' },
  { value: ORDER_STATUS.REFUNDED, label: 'Refunded' }
];

// Status Colors for StatusBadge Component
export const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: {
    bg: '#fff3cd',
    text: '#856404',
    border: '#ffeaa7'
  },
  [ORDER_STATUS.PROCESSING]: {
    bg: '#cce5ff',
    text: '#004085',
    border: '#99d6ff'
  },
  [ORDER_STATUS.SHIPPED]: {
    bg: '#d1ecf1',
    text: '#0c5460',
    border: '#bee5eb'
  },
  [ORDER_STATUS.DELIVERED]: {
    bg: '#d4edda',
    text: '#155724',
    border: '#c3e6cb'
  },
  [ORDER_STATUS.CANCELLED]: {
    bg: '#f8d7da',
    text: '#721c24',
    border: '#f5c6cb'
  },
  [ORDER_STATUS.REFUNDED]: {
    bg: '#e2e3e5',
    text: '#383d41',
    border: '#d6d8db'
  },
  // Fallback for unknown statuses
  default: {
    bg: '#f8f9fa',
    text: '#495057',
    border: '#dee2e6'
  },
  // Handle case variations from mock data
  'Pending': {
    bg: '#fff3cd',
    text: '#856404',
    border: '#ffeaa7'
  },
  'Completed': {
    bg: '#d4edda',
    text: '#155724',
    border: '#c3e6cb'
  },
  'Processing': {
    bg: '#cce5ff',
    text: '#004085',
    border: '#99d6ff'
  },
  'Cancelled': {
    bg: '#f8d7da',
    text: '#721c24',
    border: '#f5c6cb'
  }
};

// Payment Status Constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Payment Method Constants
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery'
};

// Validation Rules
export const VALIDATION_RULES = {
  customerName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  customerEmail: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  customerPhone: {
    required: false,
    minLength: 10,
    maxLength: 15
  },
  totalAmount: {
    required: true,
    min: 0
  }
};

// Order Labels
export const ORDER_LABELS = {
  customerName: 'Customer Name',
  customerEmail: 'Customer Email',
  customerPhone: 'Customer Phone',
  totalAmount: 'Total Amount',
  status: 'Order Status',
  paymentStatus: 'Payment Status',
  orderDate: 'Order Date',
  deliveryDate: 'Delivery Date'
};

// Validation Error Messages
export const VALIDATION_ERRORS = {
  customerName: 'Please enter a valid customer name (2-100 characters)',
  customerEmail: 'Please enter a valid email address',
  customerPhone: 'Please enter a valid phone number (10-15 digits)',
  totalAmount: 'Please enter a valid amount (greater than 0)',
  required: 'This field is required',
  invalidFormat: 'Invalid format',
  tooShort: 'Value is too short',
  tooLong: 'Value is too long'
};

// UI Configuration
export const UI_CONFIG = {
  itemsPerPage: 10,
  maxVisiblePages: 7,
  searchDebounceMs: 300,
  animationDuration: 200
};

// Default Order Template
export const DEFAULT_ORDER = {
    customerName: '',
    items: [],
    total: 0,
    status: 'pending',
    paymentOption: 'Online Payment',
    paymentUrl: '',
    billingAddress: {
        name: '',
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
        name: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        email: '',
        phone: ''
    }
};

// Currency Configuration
export const CURRENCY_CONFIG = {
  defaultCurrency: 'USD',
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR'],
  decimalPlaces: 2
};