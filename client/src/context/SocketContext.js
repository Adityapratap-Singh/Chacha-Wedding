import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, serverUrl }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const url = serverUrl || (process.env.REACT_APP_SERVER_URL || 'http://localhost:5001').replace('/api', '').replace(/\/$/, '');
    const s = io(url, { transports: ['websocket', 'polling'] });
    setSocket(s);
    return () => s.disconnect();
  }, [serverUrl]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
