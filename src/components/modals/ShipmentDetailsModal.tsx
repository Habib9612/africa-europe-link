import React, { useState } from 'react';
import { X, MapPin, Calendar, Package, Truck, DollarSign, Clock, User, CheckCircle } from 'lucide-react';

interface ShipmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: {
    id: string;
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    cargoType: string;
    weight: string;
    dimensions: string;
    revenue: string;
    matchScore: string;
    distance: string;
    requirements: string[];
    shipper: {
      name: string;
      company: string;
      rating: number;
    };
  };
}

const ShipmentDetailsModal: React.FC<ShipmentDetailsModalProps> = ({
  isOpen,
  onClose,
  shipment
}) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAcceptLoad = async () => {
    setIsAccepting(true);
    try {
      const response = await fetch('/api/loads/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loadId: shipment.id,
          carrierId: 'current-carrier-id', // Replace with actual carrier ID
          carrierName: 'Current Carrier', // Replace with actual carrier name
          acceptedAt: new Date().toISOString()
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAccepted(true);
        // Show success message
        alert('Load accepted successfully! You will be contacted by the shipper soon.');
      } else {
        alert('Failed to accept load: ' + result.message);
      }
    } catch (error) {
      console.error('Error accepting load:', error);
      alert('Failed to accept load. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Shipment Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Route Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Route Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700 font-medium">Origin</p>
                <p className="text-blue-900 font-semibold">{shipment.origin}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Destination</p>
                <p className="text-blue-900 font-semibold">{shipment.destination}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Distance</p>
                <p className="text-blue-900 font-semibold">{shipment.distance}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Match Score</p>
                <p className="text-blue-900 font-semibold">{shipment.matchScore}</p>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-700 font-medium">Pickup Date</p>
                <p className="text-green-900 font-semibold">{shipment.pickupDate}</p>
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Delivery Date</p>
                <p className="text-green-900 font-semibold">{shipment.deliveryDate}</p>
              </div>
            </div>
          </div>

          {/* Cargo Information */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Cargo Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-orange-700 font-medium">Type</p>
                <p className="text-orange-900 font-semibold">{shipment.cargoType}</p>
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Weight</p>
                <p className="text-orange-900 font-semibold">{shipment.weight}</p>
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Dimensions</p>
                <p className="text-orange-900 font-semibold">{shipment.dimensions}</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Financial Details
            </h3>
            <div>
              <p className="text-sm text-purple-700 font-medium">Potential Revenue</p>
              <p className="text-2xl text-purple-900 font-bold">{shipment.revenue}</p>
            </div>
          </div>

          {/* Shipper Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Shipper Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700 font-medium">Contact Person</p>
                <p className="text-gray-900 font-semibold">{shipment.shipper.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Company</p>
                <p className="text-gray-900 font-semibold">{shipment.shipper.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Rating</p>
                <div className="flex items-center">
                  <span className="text-gray-900 font-semibold mr-2">{shipment.shipper.rating}/5</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < shipment.shipper.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Special Requirements
            </h3>
            <ul className="space-y-2">
              {shipment.requirements.map((req, index) => (
                <li key={index} className="flex items-center text-red-800">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={handleAcceptLoad}
            disabled={isAccepting || isAccepted}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isAccepted 
                ? 'bg-green-600 text-white cursor-not-allowed' 
                : isAccepting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAccepted ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Load Accepted
              </>
            ) : isAccepting ? (
              'Accepting...'
            ) : (
              'Accept Load'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsModal;