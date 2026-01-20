import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_COLORS } from '../../utils/orderConstants';
import './StatusBadge.css';

/**
 * StatusBadge Component - Displays order status with appropriate styling
 */
const StatusBadge = ({ 
  status, 
  size = 'medium',
  variant = 'default',
  className = '' 
}) => {
  // Handle undefined or empty status
  const safeStatus = status || 'default';
  const statusColor = STATUS_COLORS[safeStatus] || STATUS_COLORS.default;
  
  const badgeStyle = {
    backgroundColor: statusColor?.bg || '#f8f9fa',
    color: statusColor?.text || '#495057',
    border: `1px solid ${statusColor?.border || '#dee2e6'}`,
  };

  const sizeClass = `status-badge--${size}`;
  const variantClass = `status-badge--${variant}`;

  return (
    <span 
      className={`status-badge ${sizeClass} ${variantClass} ${className}`}
      style={badgeStyle}
      title={status}
    >
      {status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'pill', 'outline']),
  className: PropTypes.string
};

export default StatusBadge;