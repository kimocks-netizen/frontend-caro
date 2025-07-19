import React from 'react';
import QuoteStatus from '../../components/quotes/QuoteStatus';
import Layout from '../../components/layout/Layout';

const QuoteTrackPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <QuoteStatus />
      </div>
    </Layout>
  );
};

export default QuoteTrackPage;