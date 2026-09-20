/**
 * App.jsx: Enrutador Principal de DioFaFarma
 * 
 * Configura las rutas del sistema mediante React Router:
 * /                     -> Home (Dashboard)
 * /productos            -> Productos (Catálogo)
 * /productos/nuevo      -> ProductoNuevo (Alta)
 * /productos/editar/:id -> ProductoEditar (Modificación)
 * *                     -> Redirección a /
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoNuevo from './pages/ProductoNuevo';
import ProductoEditar from './pages/ProductoEditar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Dashboard Inicio */}
          <Route index element={<Home />} />

          {/* Módulo de Productos */}
          <Route path="productos" element={<Productos />} />
          <Route path="productos/nuevo" element={<ProductoNuevo />} />
          <Route path="productos/editar/:id" element={<ProductoEditar />} />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
