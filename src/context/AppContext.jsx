/**
 * AppContext: Contexto Global de la Aplicación DioFaFarma
 * 
 * Gestiona el estado transversal del sistema mediante la Context API de React:
 * - Usuario y sesión (preparado para autenticación)
 * - Nombre oficial del sistema
 * - Notificaciones / Alertas globales
 * - Control del Sidebar responsive
 */

import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Información de usuario preparada para autenticación futura
  const [usuario, setUsuario] = useState({
    id: 1,
    nombre: 'Farmacéutico Administrador',
    email: 'admin@diofafarma.com',
    rol: 'Administrador Farmacéutico'
  });

  // Nombre oficial del sistema
  const sistemaNombre = 'DioFaFarma';

  // Control de apertura del sidebar en pantallas pequeñas
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Alertas o notificaciones globales en la aplicación
  const [globalAlert, setGlobalAlert] = useState(null);

  /**
   * Muestra una alerta global temporal
   * @param {string} message - Texto del mensaje
   * @param {'success'|'error'|'warning'|'info'} type - Tipo de alerta
   * @param {number} timeout - Milisegundos antes de ocultarse (0 para persistente)
   */
  const showAlert = (message, type = 'success', timeout = 4000) => {
    setGlobalAlert({ message, type });
    if (timeout > 0) {
      setTimeout(() => {
        setGlobalAlert(null);
      }, timeout);
    }
  };

  const clearAlert = () => {
    setGlobalAlert(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Espacio preparado para cerrar sesión en el futuro
  const logout = () => {
    showAlert('Sesión cerrada correctamente (simulación)', 'info');
  };

  const value = {
    usuario,
    setUsuario,
    sistemaNombre,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    globalAlert,
    showAlert,
    clearAlert,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook personalizado para consumir AppContext de forma sencilla
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe utilizarse dentro de un AppProvider');
  }
  return context;
};

export default AppContext;
