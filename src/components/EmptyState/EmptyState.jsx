import React from 'react';
import './EmptyState.css';

const EmptyState = ({ icon = '📦', title = 'No Data Found', description = 'No data available.' }) => (
  <div className="order-list__empty-state">
    <div className="order-list__empty-icon">{icon}</div>
    <h3 className="order-list__empty-title">{title}</h3>
    <p className="order-list__empty-description">{description}</p>
  </div>
);

export default EmptyState;
