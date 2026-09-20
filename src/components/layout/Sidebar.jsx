/**
 * Componente de Layout: Sidebar
 * 
 * Barra lateral de navegación principal del sistema DioFaFarma.
 * Opciones activas: Inicio, Productos.
 * Opciones preparadas para el futuro: Inventario, Ventas, Compras, Proveedores, Clientes, Reportes.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen, showAlert } = useAppContext();

  // Lista de ítems del menú requeridos
  const navItems = [
    { label: 'Inicio', path: '/', active: true, icon: '🏠' },
    { label: 'Productos', path: '/productos', active: true, icon: '💊' },
    { label: 'Inventario', path: '/inventario', active: false, icon: '📦' },
    { label: 'Ventas', path: '/ventas', active: false, icon: '🛒' },
    { label: 'Compras', path: '/compras', active: false, icon: '📥' },
    { label: 'Proveedores', path: '/proveedores', active: false, icon: '🏭' },
    { label: 'Clientes', path: '/clientes', active: false, icon: '👥' },
    { label: 'Reportes', path: '/reportes', active: false, icon: '📊' },
  ];

  const handleFutureNav = (e, itemLabel) => {
    e.preventDefault();
    showAlert(`El módulo de ${itemLabel} se encuentra preparado para la siguiente fase del backend.`, 'info');
  };

  const closeSidebarOnMobile = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay para cerrar en dispositivos móviles */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Marca oficial DioFaFarma */}
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <span style={{ fontSize: '1.25rem' }}>⚕</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">DioFaFarma</span>
            <span className="brand-subtitle">Farmacia Web</span>
          </div>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            if (item.active) {
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeSidebarOnMobile}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            }

            return (
              <a
                key={item.label}
                href={item.path}
                className="nav-link disabled"
                onClick={(e) => handleFutureNav(e, item.label)}
                title={`Módulo de ${item.label} preparado para futuras fases`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                <span className="nav-badge-soon">Pronto</span>
              </a>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        <div className="sidebar-footer">
          <p>© 2026 DioFaFarma</p>
          <p style={{ opacity: 0.7, marginTop: '2px' }}>v1.0.0 Frontend React</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
