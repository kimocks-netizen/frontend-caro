import React, { useRef } from 'react';
import { FaDownload, FaPrint, FaTimes } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

interface QuotePDFProps {
  quote: any;
  onClose: () => void;
}

const QuotePDF: React.FC<QuotePDFProps> = ({ quote, onClose }) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const subtotal = quote.quote_items?.reduce((sum: number, item: any) => {
    return sum + ((parseFloat(item.unit_price) || 0) * item.quantity);
  }, 0) || 0;

  const vatAmount = subtotal * (quote.vat_rate / 100);
  const total = subtotal + vatAmount;

  const handleDownloadPdf = () => {
    if (pdfRef.current) {
      const opt = {
        margin: 0.5,
        filename: `Quote-${quote.quote_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().from(pdfRef.current).set(opt).save();
    }
  };

  const handlePrint = () => {
    if (pdfRef.current) {
      const opt = {
        margin: 0.5,
        filename: `Quote-${quote.quote_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().from(pdfRef.current).set(opt).print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Quote PDF - {quote.quote_number}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPrint />
              Print
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FaDownload />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <FaTimes />
              Close
            </button>
          </div>
        </div>

        {/* Hidden printable content */}
        <div ref={pdfRef} className="p-6 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Caro Group Investments</h1>
              <div className="text-sm text-gray-600">
                6764 Seedcracker St, Centurion, 0173<br />
                Company Reg: 2021/459703/07<br />
                Tel: +27 60 475 5243 | Email: info@carogroupinvestments.com
              </div>
            </div>

            {/* Quote Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quote To:</h2>
                <div className="text-gray-700">
                  <p className="font-semibold text-lg">{quote.guest_name}</p>
                  <p>{quote.guest_email}</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quote Details:</h2>
                <div className="text-gray-700">
                  <p><strong>Quote Number:</strong> {quote.quote_number}</p>
                  <p><strong>Date:</strong> {formatDate(quote.created_at)}</p>
                  <p><strong>Valid Until:</strong> {formatDate(quote.valid_until)}</p>
                  <p><strong>Status:</strong> {quote.status.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Items Quoted</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left font-semibold">Description</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">Quantity</th>
                    <th className="border border-gray-300 p-3 text-right font-semibold">Unit Price</th>
                    <th className="border border-gray-300 p-3 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.quote_items?.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="border border-gray-300 p-3">
                        <div className="font-semibold">{item.product?.title}</div>
                        <div className="text-sm text-gray-600">{item.product?.description}</div>
                        {item.message && (
                          <div className="text-sm text-gray-500 italic mt-1">
                            Note: {item.message}
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 p-3 text-right">{formatCurrency(parseFloat(item.unit_price) || 0)}</td>
                      <td className="border border-gray-300 p-3 text-right">{formatCurrency((parseFloat(item.unit_price) || 0) * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="text-right mb-8">
              <div className="text-lg">
                <p className="mb-2">Subtotal: {formatCurrency(subtotal)}</p>
                <p className="mb-2">VAT (15%): {formatCurrency(vatAmount)}</p>
                <p className="text-2xl font-bold border-t-2 border-gray-300 pt-2">
                  Total: {formatCurrency(total)}
                </p>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• This quote is valid for 7 days from the date of issue</li>
                <li>• Prices are subject to change without prior notice</li>
                <li>• Payment terms: 50% deposit required on order confirmation</li>
                <li>• Delivery time: 5-10 business days after payment confirmation</li>
                <li>• All prices include VAT at 15%</li>
                <li>• Returns accepted within 7 days of delivery (subject to conditions)</li>
              </ul>
            </div>

            {/* Banking Details */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Banking Details</h2>
              <div className="text-gray-700">
                <p><strong>Bank Name:</strong> FNB</p>
                <p><strong>Branch Code:</strong> 250856</p>
                <p><strong>Swift Code:</strong> FNBNZAJJ</p>
                <p><strong>Account Number:</strong> 62890768371</p>
                <p><strong>Payment Reference:</strong> {quote.quote_number}</p>
              </div>
            </div>

            {/* Admin Notes */}
            {quote.admin_notes && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Notes</h2>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-gray-700">{quote.admin_notes}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center border-t-2 border-gray-300 pt-6">
              <p className="text-lg font-semibold text-gray-900 mb-2">Thank you for your business!</p>
              <p className="text-gray-600">Caro Group Investments - Your trusted partner for quality auto parts</p>
              <p className="text-sm text-gray-500 mt-2">www.carogroupinvestments.com | info@carogroupinvestments.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePDF; 