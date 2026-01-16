import React from 'react';
import './Button.css';

const Button = ({
  children,
  type = 'button',
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
