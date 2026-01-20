import { VALIDATION_RULES, VALIDATION_ERRORS, ORDER_STATUS } from './orderConstants';

/**
 * Validate individual field based on validation rules
 */
export const validateField = (fieldName, value, rules = VALIDATION_RULES[fieldName]) => {
  if (!rules) return { isValid: true, error: null };

  const errors = [];

  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push(VALIDATION_ERRORS.required);
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return {
      isValid: errors.length === 0,
      error: errors[0] || null
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value.toString())) {
    switch (fieldName) {
      case 'customerEmail':
        errors.push(VALIDATION_ERRORS.customerEmail);
        break;
      case 'customerPhone':
        errors.push(VALIDATION_ERRORS.customerPhone);
        break;
      default:
        errors.push(VALIDATION_ERRORS.invalidFormat);
    }
  }

  // Length validations
  if (rules.minLength && value.toString().length < rules.minLength) {
    errors.push(VALIDATION_ERRORS.tooShort);
  }

  if (rules.maxLength && value.toString().length > rules.maxLength) {
    errors.push(VALIDATION_ERRORS.tooLong);
  }

  return {
    isValid: errors.length === 0,
    error: errors[0] || null
  };
};

/**
 * Validate complete order object
 */
export const validateOrder = (order) => {
  const errors = {};

  // Validate customer name
  const customerNameValidation = validateField('customerName', order.customerName);
  if (!customerNameValidation.isValid) {
    errors.customerName = customerNameValidation.error;
  }

  // Validate items
  if (!order.items || order.items.length === 0) {
    errors.items = 'At least one item is required';
  } else {
    // Validate individual items
    order.items.forEach((item, index) => {
      if (!item.name || !item.name.trim()) {
        errors[`item_${index}_name`] = 'Item name is required';
      }
      if (!item.price || parseFloat(item.price) <= 0) {
        errors[`item_${index}_price`] = 'Item price must be greater than 0';
      }
      if (!item.quantity || parseInt(item.quantity) <= 0) {
        errors[`item_${index}_quantity`] = 'Item quantity must be greater than 0';
      }
    });
  }

  // Validate billing address
  if (order.billingAddress) {
    const billingFields = ['firstName', 'lastName', 'address', 'city', 'email', 'phone'];
    billingFields.forEach(field => {
      const validation = validateField(field, order.billingAddress[field]);
      if (!validation.isValid) {
        errors[`billing_${field}`] = validation.error;
      }
    });
  }

  // Validate shipping address if different from billing
  if (order.shippingAddress && order.shippingAddress !== order.billingAddress) {
    const shippingFields = ['firstName', 'lastName', 'address', 'city'];
    shippingFields.forEach(field => {
      const validation = validateField(field, order.shippingAddress[field]);
      if (!validation.isValid) {
        errors[`shipping_${field}`] = validation.error;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate order status transition
 */
export const validateStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    [ORDER_STATUS.PENDING]: [
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.ON_HOLD,
      ORDER_STATUS.CANCELLED
    ],
    [ORDER_STATUS.PROCESSING]: [
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.ON_HOLD,
      ORDER_STATUS.CANCELLED
    ],
    [ORDER_STATUS.ON_HOLD]: [
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.CANCELLED
    ],
    [ORDER_STATUS.COMPLETED]: [
      ORDER_STATUS.REFUNDED
    ],
    [ORDER_STATUS.CANCELLED]: [],
    [ORDER_STATUS.REFUNDED]: [],
    [ORDER_STATUS.FAILED]: [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.CANCELLED
    ]
  };

  const allowedStatuses = validTransitions[currentStatus] || [];
  
  return {
    isValid: allowedStatuses.includes(newStatus),
    error: allowedStatuses.includes(newStatus) 
      ? null 
      : `Cannot change status from ${currentStatus} to ${newStatus}`
  };
};

/**
 * Sanitize and format input values
 */
export const sanitizeInput = (value, type = 'text') => {
  if (value === null || value === undefined) return '';
  
  switch (type) {
    case 'text':
    case 'email':
      return value.toString().trim();
    case 'phone':
      return value.toString().replace(/[^\d+\-\s()]/g, '').trim();
    case 'number':
      return parseFloat(value) || 0;
    case 'integer':
      return parseInt(value) || 0;
    default:
      return value;
  }
};

/**
 * Format currency value
 */
export const formatCurrency = (amount, currency = 'USD') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(amount || 0);
};

/**
 * Format date for display
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options })
      .format(dateObj);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Calculate order totals
 */
export const calculateOrderTotals = (items = [], shippingPrice = 0, taxRate = 0) => {
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    const itemQuantity = parseInt(item.quantity) || 1;
    return sum + (itemPrice * itemQuantity);
  }, 0);

  const shipping = parseFloat(shippingPrice) || 0;
  const tax = subtotal * (parseFloat(taxRate) || 0);
  const total = subtotal + shipping + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};