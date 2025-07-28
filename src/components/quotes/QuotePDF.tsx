import React, { useRef } from 'react';
import { FaDownload, FaPrint, FaTimes } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import { useTheme } from '../../context/ThemeContext';

interface QuotePDFProps {
  quote: any;
  onClose: () => void;
}

const QuotePDF: React.FC<QuotePDFProps> = ({ quote, onClose }) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

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

      // Generate PDF and open in new window for printing
      html2pdf().from(pdfRef.current).set(opt).toPdf().get('pdf').then((pdf: any) => {
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Open in new window and trigger print
        const printWindow = window.open(pdfUrl, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className={`rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`sticky top-0 border-b p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-lg sm:text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Quote PDF - {quote.quote_number}</h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <FaPrint className="text-sm" />
              <span className="hidden sm:inline">Print</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              <FaDownload className="text-sm" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">Download</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              <FaTimes className="text-sm" />
              <span className="hidden sm:inline">Close</span>
              <span className="sm:hidden">Close</span>
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          {/* Hidden printable content */}
          <div ref={pdfRef} className="p-4 sm:p-6 bg-white">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8 border-b-2 border-gray-300 pb-4 sm:pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Caro Group Investments</h1>
                <div className="text-xs sm:text-sm text-gray-600">
                  6764 Seedcracker St, Centurion, 0173<br />
                  Company Reg: 2021/459703/07<br />
                  Tel: +27 60 475 5243 | Email: info@carogroupinvestments.com
                </div>
              </div>

              {/* Quote Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                <div className="text-left">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4 text-left">Quote To:</h2>
                  <div className="text-gray-700 text-left">
                    <p className="font-semibold text-base sm:text-lg text-left">{quote.guest_name}</p>
                    <p className="text-sm sm:text-base text-left">{quote.guest_email}</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">Quote Details:</h2>
                  <div className="text-gray-700 text-sm sm:text-base">
                    <p><strong>Quote Number:</strong> {quote.quote_number}</p>
                    <p><strong>Date:</strong> {formatDate(quote.created_at)}</p>
                    <p><strong>Valid Until:</strong> {formatDate(quote.valid_until)}</p>
                    <p><strong>Status:</strong> {quote.status.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Items Quoted</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-gray-900">Description</th>
                        <th className="border border-gray-300 p-2 sm:p-3 text-center font-semibold text-gray-900">Qty</th>
                        <th className="border border-gray-300 p-2 sm:p-3 text-right font-semibold text-gray-900">Unit Price</th>
                        <th className="border border-gray-300 p-2 sm:p-3 text-right font-semibold text-gray-900">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.quote_items?.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-gray-300">
                          <td className="border border-gray-300 p-2 sm:p-3 text-left">
                            <div className="font-semibold text-sm sm:text-base text-gray-900 text-left">{item.product?.title}</div>
                            <div className="text-xs sm:text-sm text-gray-600 text-left">{item.product?.description}</div>
                            {item.message && (
                              <div className="text-xs sm:text-sm text-gray-500 italic mt-1 text-left">
                                Note: {item.message}
                              </div>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2 sm:p-3 text-center text-gray-900">{item.quantity}</td>
                          <td className="border border-gray-300 p-2 sm:p-3 text-right text-gray-900">{formatCurrency(parseFloat(item.unit_price) || 0)}</td>
                          <td className="border border-gray-300 p-2 sm:p-3 text-right text-gray-900">{formatCurrency((parseFloat(item.unit_price) || 0) * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="text-right mb-6 sm:mb-8">
                <div className="text-base sm:text-lg">
                  <p className="mb-2">Subtotal: {formatCurrency(subtotal)}</p>
                  <p className="mb-2">VAT (15%): {formatCurrency(vatAmount)}</p>
                  <p className="text-xl sm:text-2xl font-bold border-t-2 border-gray-300 pt-2">
                    Total: {formatCurrency(total)}
                  </p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="mb-6 sm:mb-8 text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-left">Terms & Conditions</h2>
                <ul className="text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-2 text-left">
                  <li className="text-left">• This quote is valid for 7 days from the date of issue</li>
                  <li className="text-left">• Prices are subject to change without prior notice</li>
                  <li className="text-left">• Payment terms: 50% deposit required on order confirmation</li>
                  <li className="text-left">• Delivery time: 5-10 business days after payment confirmation</li>
                  <li className="text-left">• All prices include VAT at 15%</li>
                  <li className="text-left">• Returns accepted within 7 days of delivery (subject to conditions)</li>
                </ul>
              </div>

              {/* Banking Details */}
              <div className="mb-6 sm:mb-8 bg-gray-50 p-4 sm:p-6 rounded-lg text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-left">Banking Details</h2>
                <div className="text-gray-700 text-sm sm:text-base text-left">
                  <p className="text-left"><strong>Bank Name:</strong> FNB</p>
                  <p className="text-left"><strong>Branch Code:</strong> 250856</p>
                  <p className="text-left"><strong>Swift Code:</strong> FNBNZAJJ</p>
                  <p className="text-left"><strong>Account Number:</strong> 62890768371</p>
                  <p className="text-left"><strong>Payment Reference:</strong> {quote.quote_number}</p>
                </div>
              </div>

              {/* Admin Notes */}
              {quote.admin_notes && (
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Additional Notes</h2>
                  <div className="bg-yellow-50 border border-yellow-200 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-700 text-sm sm:text-base">{quote.admin_notes}</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="text-center border-t-2 border-gray-300 pt-4 sm:pt-6">
                <p className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Thank you for your business!</p>
                <p className="text-gray-600 text-sm sm:text-base">Caro Group Investments - Your trusted partner for quality equipment and services.</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">www.carogroupinvestments.com | info@carogroupinvestments.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePDF; 