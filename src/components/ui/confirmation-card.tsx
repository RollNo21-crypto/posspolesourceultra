import React from 'react';
import { Download, Mail, Phone } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ConfirmationCardProps {
  type: 'buy' | 'donate' | 'seller';
  data: {
    name: string;
    email: string;
    phone: string;
    id?: string;
    items?: Array<{
      title: string;
      category: string;
      price?: number;
      quantity?: number;
    }>;
    companyName?: string;
    categories?: string;
  };
  onClose: () => void;
}

export function ConfirmationCard({ type, data, onClose }: ConfirmationCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const getTitle = () => {
    switch (type) {
      case 'buy':
        return 'Quote Request Confirmation';
      case 'donate':
        return 'Donation Request Confirmation';
      case 'seller':
        return 'Seller Registration Confirmation';
      default:
        return 'Confirmation';
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${type}-confirmation-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
        <div ref={cardRef} className="p-4 sm:p-6 md:p-8 bg-white">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{getTitle()}</h2>
            <p className="text-sm sm:text-base text-gray-600">
              {type === 'seller' 
                ? 'Thank you for registering as a seller!'
                : 'Thank you for your request!'}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Reference Number */}
            {data.id && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-sm text-gray-600">Reference Number</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900 font-mono">{data.id}</p>
              </div>
            )}

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  {type === 'seller' ? 'Company Details' : 'Contact Details'}
                </h3>
                {type === 'seller' && data.companyName && (
                  <p className="text-sm sm:text-base text-gray-600 mb-2">
                    <span className="font-medium">Company:</span> {data.companyName}
                  </p>
                )}
                <p className="text-sm sm:text-base text-gray-600 mb-2">
                  <span className="font-medium">Name:</span> {data.name}
                </p>
                <p className="text-sm sm:text-base text-gray-600 mb-2">
                  <span className="font-medium">Email:</span> {data.email}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-medium">Phone:</span> {data.phone}
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Support Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm sm:text-base text-gray-600">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span>support@posspole.com</span>
                  </div>
                  <div className="flex items-center text-sm sm:text-base text-gray-600">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span>+91 (800) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items List */}
            {data.items && data.items.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  {type === 'buy' ? 'Requested Items' : 'Items for Donation'}
                </h3>
                <div className="space-y-3">
                  {data.items.map((item, index) => (
                    <div key={index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm sm:text-base text-gray-900">{item.title}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {item.category} • Quantity: {item.quantity || 1}
                        </p>
                      </div>
                      {type === 'buy' && item.price && (
                        <div className="text-right">
                          <p className="font-semibold text-sm sm:text-base text-gray-900">
                            ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              (₹{item.price.toLocaleString()} each)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Next Steps</h3>
              <p className="text-sm sm:text-base text-blue-700">
                {type === 'seller'
                  ? 'Our team will review your application and contact you within 2-3 business days.'
                  : 'Our team will review your request and get back to you shortly with more information.'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}