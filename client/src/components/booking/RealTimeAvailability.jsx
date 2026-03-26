import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const RealTimeAvailability = ({ date, serviceId, onSlotSelect, selectedSlot }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchSlots();
  }, [date, serviceId]);

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time availability updates
    const handleAvailabilityUpdate = (data) => {
      if (data.date === date.toISOString().split('T')[0]) {
        setSlots(data.availableSlots);
        setRealTimeUpdates(prev => [...prev, {
          message: `Slot ${data.updatedSlot} was just booked`,
          timestamp: new Date()
        }]);
        
        // Clear notification after 5 seconds
        setTimeout(() => {
          setRealTimeUpdates(prev => prev.slice(1));
        }, 5000);
      }
    };

    socket.on('availability-update', handleAvailabilityUpdate);
    
    return () => {
      socket.off('availability-update', handleAvailabilityUpdate);
    };
  }, [socket, date]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      const response = await api.get(`/appointments/available-slots/${formattedDate}`, {
        params: { serviceId }
      });
      setSlots(response.data.data);
    } catch (error) {
      toast.error('Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    if (selectedSlot === slot) {
      onSlotSelect(null);
    } else {
      onSlotSelect(slot);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Real-time connection status */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-600">Live updates active</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-600">Connecting to live updates...</span>
            </>
          )}
        </div>
        <button
          onClick={fetchSlots}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Real-time notifications */}
      {realTimeUpdates.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          {realTimeUpdates.map((update, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-yellow-800">
              <Clock className="h-4 w-4" />
              <span>{update.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Time slots grid */}
      {slots.length > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => handleSlotClick(slot)}
              className={`
                relative py-3 px-4 rounded-lg text-center font-medium transition-all
                ${selectedSlot === slot
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {slot}
              {selectedSlot === slot && (
                <div className="absolute -top-2 -right-2">
                  <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No available slots for this date</p>
          <p className="text-sm text-gray-400 mt-1">Please select another date</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-600 rounded" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Live updates</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAvailability;