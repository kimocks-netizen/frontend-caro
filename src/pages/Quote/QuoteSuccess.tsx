import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';

const QuoteSuccess: React.FC = () => {
  const location = useLocation();
  const trackingCode = location.state?.trackingCode as string;

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Quote Request Submitted!</h1>
      <p className="mb-6">Your tracking code is: <strong>{trackingCode}</strong></p>
      <p className="mb-6">We'll send a confirmation to your email shortly.</p>
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={() => navigator.clipboard.writeText(trackingCode)}
          variant="secondary"
        >
          Copy Tracking Code
        </Button>
        <Button 
          onClick={() => window.location.href = '/quote/track'}
          variant="primary"
        >
          Track Your Quote
        </Button>
      </div>
    </div>
  );
};

export default QuoteSuccess;