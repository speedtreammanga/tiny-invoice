import React from 'react';

export const Button = ({ children, variant = 'filled', className = '', ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  
  const variantStyles = {
    filled: "bg-blue-500 hover:bg-blue-600 text-white",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
