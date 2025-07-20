import React from 'react';
import QuoteStatus from '../../components/quotes/QuoteStatus';

const QuoteTrackPage: React.FC = () => {
  return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <QuoteStatus />
      </div>
  );
};

export default QuoteTrackPage;