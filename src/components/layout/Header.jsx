/**
 * Componente de Layout: Header
 * 
 * Cabecera superior del sistema DioFaFarma.
 * Muestra el nombre oficial, información del usuario y botón preparado para logout.
 */

import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../common/Button';

const Header = () => {
  const { usuario, sistemaNombre, toggleSidebar, logout } = useAppContext();

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Botón menú responsive para móviles */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Abrir menú de navegación"
        >
          ☰
        </button>

        <div>
          <span className="header-title-badge">Gestión Farmacéutica</span>
        </div>
      </div>

      <div className="header-right">
        {/* Perfil del usuario autenticado (preparado para el futuro) */}
        <div className="user-profile-widget">
          <div className="user-avatar" title={usuario?.nombre}>
            {usuario?.nombre ? usuario.nombre.charAt(0) : 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{usuario?.nombre || 'Usuario'}</span>
            <span className="user-role">{usuario?.rol || 'Personal Farmacia'}</span>
          </div>
        </div>

        {/* Botón preparado para cerrar sesión */}
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          title="Espacio preparado para cerrar sesión"
        >
          Cerrar Sesión
        </Button>
      </div>
    </header>
  );
};

export default Header;
