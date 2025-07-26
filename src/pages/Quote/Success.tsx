import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const QuoteSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const trackingCode = location.state?.trackingCode as string;

  return (
      <div className="container mx-auto px-4 py-8 text-center max-w-2xl">
        <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-4">Quote Request Submitted!</h1>
          <p className="mb-4">Your tracking code is:</p>
          <p className="text-2xl font-mono font-bold mb-6">{trackingCode}</p>
          <p>We'll send a confirmation to your email shortly.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => navigator.clipboard.writeText(trackingCode)}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Copy Tracking Code
          </Button>
          <Button
            onClick={() => navigate('/quote/track', { state: { trackingCode } })}
            variant="primary"
            className="w-full sm:w-auto"
          >
            Track Your Quote
          </Button>
        </div>
      </div>
  );
};

export default QuoteSuccessPage;