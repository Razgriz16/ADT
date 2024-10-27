// MessageContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const MessageContext = createContext();

// Proveedor del contexto
export const MessageProvider = ({ children }) => {
  const [mensaje, setMensaje] = useState('');

  const enviarMensaje = (nuevoMensaje) => {
    setMensaje(nuevoMensaje);
  };

  return (
    <MessageContext.Provider value={{ mensaje, enviarMensaje }}>
      {children}
    </MessageContext.Provider>
  );
};
