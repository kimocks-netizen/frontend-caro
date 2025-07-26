import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface QuotePDFProps {
  quote: any;
  onClose: () => void;
}

const QuotePDF: React.FC<QuotePDFProps> = ({ quote, onClose }) => {
  const { isDarkMode } = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const subtotal = quote.quote_items?.reduce((sum: number, item: any) => sum + (parseFloat(item.total_price) || 0), 0) || 0;
  const vatAmount = subtotal * 0.15;
  const total = subtotal + vatAmount;

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print quote');
      return;
    }

    // Get the quote content
    const quoteContent = document.querySelector('.quote-content');
    if (!quoteContent) {
      alert('Quote content not found');
      return;
    }

    // Create the print content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quote ${quote.quote_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .company-details { font-size: 12px; color: #666; }
            .quote-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .customer-info, .quote-info { flex: 1; }
            .quote-info { text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .totals { text-align: right; margin-bottom: 30px; }
            .total-row { font-weight: bold; font-size: 18px; }
            .terms { margin-bottom: 30px; }
            .banking { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Caro Group Investments</div>
            <div class="company-details">
              818 Olympus Dr, Olympus AH, Pretoria, 0081<br>
              Company Reg: 566764949494-163<br>
              Tel: +27 12 345 6789 | Email: info@carogroup.co.za
            </div>
          </div>

          <div class="quote-details">
            <div class="customer-info">
              <h2>Quote To:</h2>
              <p><strong>${quote.guest_name}</strong></p>
              <p>${quote.guest_email}</p>
            </div>
            <div class="quote-info">
              <h2>Quote Details:</h2>
              <p><strong>Quote Number:</strong> ${quote.quote_number}</p>
              <p><strong>Date:</strong> ${formatDate(quote.created_at)}</p>
              <p><strong>Valid Until:</strong> ${formatDate(quote.valid_until)}</p>
              <p><strong>Status:</strong> ${quote.status.toUpperCase()}</p>
            </div>
          </div>

          <h2>Items Quoted</h2>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${quote.quote_items?.map((item: any) => `
                <tr>
                  <td>
                    <div><strong>${item.product?.title}</strong></div>
                    <div style="font-size: 12px; color: #666;">${item.product?.description}</div>
                    ${item.message ? `<div style="font-size: 11px; color: #888; font-style: italic;">Note: ${item.message}</div>` : ''}
                  </td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">${formatCurrency(parseFloat(item.unit_price) || 0)}</td>
                  <td style="text-align: right;">${formatCurrency((parseFloat(item.unit_price) || 0) * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div>Subtotal: ${formatCurrency(subtotal)}</div>
            <div>VAT (15%): ${formatCurrency(vatAmount)}</div>
            <div class="total-row">Total: ${formatCurrency(total)}</div>
          </div>

          <div class="terms">
            <h2>Terms & Conditions</h2>
            <ul style="font-size: 12px;">
              <li>This quote is valid for 7 days from the date of issue</li>
              <li>Prices are subject to change without prior notice</li>
              <li>Payment terms: 50% deposit required on order confirmation</li>
              <li>Delivery time: 5-10 business days after payment confirmation</li>
              <li>All prices include VAT at 15%</li>
              <li>Returns accepted within 7 days of delivery (subject to conditions)</li>
            </ul>
          </div>

          <div class="banking">
            <h2>Banking Details</h2>
            <p><strong>Bank Name:</strong> FNB</p>
            <p><strong>Branch Code:</strong> 677484</p>
            <p><strong>Swift Code:</strong> FNBZAYY</p>
            <p><strong>Account Number:</strong> 57894884944</p>
            <p><strong>Payment Reference:</strong> ${quote.quote_number}</p>
          </div>

          ${quote.admin_notes ? `
            <div class="terms">
              <h2>Additional Notes</h2>
              <div style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border: 1px solid #ffeaa7;">
                ${quote.admin_notes}
              </div>
            </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Caro Group Investments - Your trusted partner for quality auto parts</p>
            <p>www.carogroup.co.za | info@carogroup.co.za</p>
          </div>
        </body>
      </html>
    `;

    // Write content to new window and print
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const handleDownload = () => {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download PDF');
      return;
    }

    // Get the quote content
    const quoteContent = document.querySelector('.quote-content');
    if (!quoteContent) {
      alert('Quote content not found');
      return;
    }

    // Create the PDF content
    const pdfContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quote ${quote.quote_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .company-details { font-size: 12px; color: #666; }
            .quote-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .customer-info, .quote-info { flex: 1; }
            .quote-info { text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .totals { text-align: right; margin-bottom: 30px; }
            .total-row { font-weight: bold; font-size: 18px; }
            .terms { margin-bottom: 30px; }
            .banking { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Caro Group Investments</div>
            <div class="company-details">
              818 Olympus Dr, Olympus AH, Pretoria, 0081<br>
              Company Reg: 566764949494-163<br>
              Tel: +27 12 345 6789 | Email: info@carogroup.co.za
            </div>
          </div>

          <div class="quote-details">
            <div class="customer-info">
              <h2>Quote To:</h2>
              <p><strong>${quote.guest_name}</strong></p>
              <p>${quote.guest_email}</p>
            </div>
            <div class="quote-info">
              <h2>Quote Details:</h2>
              <p><strong>Quote Number:</strong> ${quote.quote_number}</p>
              <p><strong>Date:</strong> ${formatDate(quote.created_at)}</p>
              <p><strong>Valid Until:</strong> ${formatDate(quote.valid_until)}</p>
              <p><strong>Status:</strong> ${quote.status.toUpperCase()}</p>
            </div>
          </div>

          <h2>Items Quoted</h2>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${quote.quote_items?.map((item: any) => `
                <tr>
                  <td>
                    <div><strong>${item.product?.title}</strong></div>
                    <div style="font-size: 12px; color: #666;">${item.product?.description}</div>
                    ${item.message ? `<div style="font-size: 11px; color: #888; font-style: italic;">Note: ${item.message}</div>` : ''}
                  </td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">${formatCurrency(parseFloat(item.unit_price) || 0)}</td>
                  <td style="text-align: right;">${formatCurrency((parseFloat(item.unit_price) || 0) * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div>Subtotal: ${formatCurrency(subtotal)}</div>
            <div>VAT (15%): ${formatCurrency(vatAmount)}</div>
            <div class="total-row">Total: ${formatCurrency(total)}</div>
          </div>

          <div class="terms">
            <h2>Terms & Conditions</h2>
            <ul style="font-size: 12px;">
              <li>This quote is valid for 7 days from the date of issue</li>
              <li>Prices are subject to change without prior notice</li>
              <li>Payment terms: 50% deposit required on order confirmation</li>
              <li>Delivery time: 5-10 business days after payment confirmation</li>
              <li>All prices include VAT at 15%</li>
              <li>Returns accepted within 7 days of delivery (subject to conditions)</li>
            </ul>
          </div>

          <div class="banking">
            <h2>Banking Details</h2>
            <p><strong>Bank Name:</strong> FNB</p>
            <p><strong>Branch Code:</strong> 677484</p>
            <p><strong>Swift Code:</strong> FNBZAYY</p>
            <p><strong>Account Number:</strong> 57894884944</p>
            <p><strong>Payment Reference:</strong> ${quote.quote_number}</p>
          </div>

          ${quote.admin_notes ? `
            <div class="terms">
              <h2>Additional Notes</h2>
              <div style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border: 1px solid #ffeaa7;">
                ${quote.admin_notes}
              </div>
            </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Caro Group Investments - Your trusted partner for quality auto parts</p>
            <p>www.carogroup.co.za | info@carogroup.co.za</p>
          </div>
        </body>
      </html>
    `;

    // Write content to new window and print
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`relative w-full max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold">Quote Preview</h2>
            <div className="flex space-x-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Print
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>

          {/* Quote Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="bg-white text-black p-8 shadow-lg quote-content">
              {/* Company Header */}
              <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Caro Group Investments</h1>
                <p className="text-gray-600 mb-1">6764 Seedcracker St, Centurion, 0173</p>
                <p className="text-gray-600 mb-1">Company Reg: 2021/459703/07</p>
                <p className="text-gray-600">Tel: +27 60 475 5243| Email: info@carogroupinvestments.com</p>
              </div>

              {/* Quote Details */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Quote To:</h2>
                  <p className="font-semibold">{quote.guest_name}</p>
                  <p className="text-gray-600">{quote.guest_email}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Quote Details:</h2>
                  <p><span className="font-semibold">Quote Number:</span> {quote.quote_number}</p>
                  <p><span className="font-semibold">Date:</span> {formatDate(quote.created_at)}</p>
                  <p><span className="font-semibold">Valid Until:</span> {formatDate(quote.valid_until)}</p>
                  <p><span className="font-semibold">Status:</span> {quote.status.toUpperCase()}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Items Quoted</h2>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.quote_items?.map((item: any, index: number) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-2">
                          <div>
                            <p className="font-semibold">{item.product?.title}</p>
                            <p className="text-sm text-gray-600">{item.product?.description}</p>
                            {item.message && (
                              <p className="text-sm text-gray-500 italic">Note: {item.message}</p>
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(parseFloat(item.unit_price) || 0)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency((parseFloat(item.unit_price) || 0) * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">VAT (15%):</span>
                    <span>{formatCurrency(vatAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-gray-300 pt-2">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-lg">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Terms & Conditions</h2>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>• This quote is valid for 7 days from the date of issue</p>
                  <p>• Prices are subject to change without prior notice</p>
                  <p>• Payment terms: 50% deposit required on order confirmation</p>
                  <p>• Delivery time: 5-10 business days after payment confirmation</p>
                  <p>• All prices include VAT at 15%</p>
                  <p>• Returns accepted within 7 days of delivery (subject to conditions)</p>
                </div>
              </div>

              {/* Banking Details */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Banking Details</h2>
                <div className="bg-gray-100 p-4 rounded">
                  <p><span className="font-semibold">Bank Name:</span> FNB</p>
                  <p><span className="font-semibold">Branch Code:</span> 677484</p>
                  <p><span className="font-semibold">Swift Code:</span> FNBZAYY</p>
                  <p><span className="font-semibold">Account Number:</span> 57894884944</p>
                  <p><span className="font-semibold">Payment Reference:</span> {quote.quote_number}</p>
                </div>
              </div>

              {/* Admin Notes */}
              {quote.admin_notes && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Notes</h2>
                  <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                    <p className="text-gray-700">{quote.admin_notes}</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-sm text-gray-600 border-t-2 border-gray-300 pt-6">
                <p>Thank you for your business!</p>
                <p>Caro Group Investments - Your trusted partner for quality auto parts</p>
                <p>www.carogroup.co.za | info@carogroup.co.za</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePDF; 