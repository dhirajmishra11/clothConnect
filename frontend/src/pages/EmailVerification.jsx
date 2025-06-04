import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { FormLayout } from '../components/forms/FormLayout';
import { Button } from '../components/common/Button';

function EmailVerification() {
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = new URLSearchParams(location.search).get('token');
        if (!token) {
          setError('Invalid verification link');
          setStatus('error');
          return;
        }

        await axiosInstance.get(`/users/verify-email/${token}`);
        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed. Please try again.');
        setStatus('error');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p>Verifying your email address...</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <div className="text-green-500 text-xl mb-4">
              Email verified successfully!
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You will be redirected to the login page shortly.
            </p>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">
              Verification Failed
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <Button onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FormLayout
      title="Email Verification"
      subtitle="Verifying your email address..."
      error={status === 'error' ? error : ''}
    >
      {renderContent()}
    </FormLayout>
  );
}

export default EmailVerification;