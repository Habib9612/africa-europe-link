import React, { useState } from 'react';
import { X, Phone, Mail, MessageCircle, User, Building, Star, Send } from 'lucide-react';

interface ContactShipperModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipper: {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    rating: number;
    totalShipments: number;
    responseTime: string;
    preferredContact: string;
    avatar?: string;
  };
  shipmentId: string;
}

const ContactShipperModal: React.FC<ContactShipperModalProps> = ({
  isOpen,
  onClose,
  shipper,
  shipmentId
}) => {
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState('message');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Message sent to ${shipper.name} successfully!`);
    setMessage('');
    setIsSubmitting(false);
    onClose();
  };

  const handlePhoneCall = () => {
    window.open(`tel:${shipper.phone}`);
  };

  const handleEmail = () => {
    const subject = `Regarding Shipment ${shipmentId}`;
    const body = `Hello ${shipper.name},\n\nI am interested in your shipment (ID: ${shipmentId}). Please let me know if you would like to discuss the details.\n\nBest regards`;
    window.open(`mailto:${shipper.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Contact Shipper</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Shipper Profile */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                {shipper.avatar ? (
                  <img src={shipper.avatar} alt={shipper.name} className="w-16 h-16 rounded-full" />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{shipper.name}</h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{shipper.company}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{shipper.rating}/5</span>
                  </div>
                  <span className="text-sm text-gray-600">{shipper.totalShipments} shipments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <Phone className="h-4 w-4 mr-3 text-green-600" />
                <span>{shipper.phone}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="h-4 w-4 mr-3 text-blue-600" />
                <span>{shipper.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MessageCircle className="h-4 w-4 mr-3 text-purple-600" />
                <span>Avg. response time: {shipper.responseTime}</span>
              </div>
            </div>
          </div>

          {/* Quick Contact Options */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Quick Contact</h4>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handlePhoneCall}
                className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Phone className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-green-800">Call</span>
              </button>
              <button
                onClick={handleEmail}
                className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Mail className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-blue-800">Email</span>
              </button>
              <button
                onClick={() => setContactMethod('message')}
                className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
                  contactMethod === 'message'
                    ? 'bg-purple-100 border-2 border-purple-300'
                    : 'bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <MessageCircle className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-purple-800">Message</span>
              </button>
            </div>
          </div>

          {/* Message Form */}
          {contactMethod === 'message' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Send Message</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to {shipper.name}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hello ${shipper.name}, I'm interested in discussing the shipment details for load ${shipmentId}. Please let me know when would be a good time to connect.`}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>💡 <strong>Tip:</strong> Include your availability and preferred communication method for faster response.</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {contactMethod === 'message' && (
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactShipperModal;