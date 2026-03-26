import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token || !user) return;

    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('new-booking', (appointment) => {
      toast.success(`New booking from ${appointment.customer.name}`);
    });

    newSocket.on('booking-cancelled', (appointment) => {
      toast.info(`Booking cancelled: ${appointment.appointmentNumber}`);
    });

    newSocket.on('booking-updated', (appointment) => {
      toast.success(`Booking updated: ${appointment.appointmentNumber}`);
    });

    newSocket.on('availability-update', (data) => {
      // Update available slots in real-time
      window.dispatchEvent(new CustomEvent('availability-update', { detail: data }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, user]);

  const emit = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
  };

  const value = {
    socket,
    isConnected,
    emit,
    on
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};