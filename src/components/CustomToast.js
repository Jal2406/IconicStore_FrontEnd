import { Toaster } from 'react-hot-toast';
import React from 'react';

const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        className: '',
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: '14px',
          maxWidth: '350px',
          display: 'flex',
          alignItems: 'center',
        },
        
        // Custom styles for different toast types
        success: {
          style: {
            background: 'linear-gradient(to right, #00b09b, #96c93d)',
          },
          iconTheme: {
            primary: 'white',
            secondary: 'transparent',
          },
        },
        info: {
          style: {
            background: 'linear-gradient(to right, #2193b0, #6dd5ed)', // Blue gradient
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: 'transparent',
          },
        },

        error: {
          style: {
            background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
          },
          iconTheme: {
            primary: 'white',
            secondary: 'transparent',
          },
        },
        loading: {
          style: {
            background: 'linear-gradient(to right, #4b6cb7, #182848)',
          },
        },
      }}
    />
  );
};

export default CustomToaster;