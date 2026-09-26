/**
 * Servicio exclusivo para las operaciones de Productos en DioFaFarma.
 *
 * Contiene la lógica de comunicación con la REST API Node.js o almacenamiento simulado local.
 * NO contiene JSX, componentes ni lógica visual.
 *
 * La API responde con el formato:
 *   { success: boolean, message: string, data: Object|Array }
 */

import { httpClient, USE_MOCK_DATA } from './api';
import { MOCK_PRODUCTOS } from '../data/mockProductos';

// Clave para persistir datos simulados en el navegador (solo en modo mock)
const STORAGE_KEY = 'diofafarma_mock_productos';

// Helper para inicializar y obtener el almacén mock local
const getLocalStore = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PRODUCTOS));
    return [...MOCK_PRODUCTOS];
  }
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PRODUCTOS));
    return [...MOCK_PRODUCTOS];
  }
};

// Helper para guardar en el almacén mock local
const saveLocalStore = (productos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
};

// Pequeño retardo para simular latencia de red en modo mock
const simulateNetworkDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Normaliza un producto proveniente de la API REST Node.js.
 * La API ya devuelve camelCase desde el mapper del backend,
 * pero mantenemos compatibilidad con snake_case por si acaso.
 */
const mapFromBackend = (item) => ({
  id:           item.id,
  codigo:       item.codigo,
  nombre:       item.nombre,
  descripcion:  item.descripcion  || '',
  laboratorio:  item.laboratorio  || '',
  precioCompra: Number(item.precioCompra ?? item.precio_compra ?? 0),
  precioVenta:  Number(item.precioVenta  ?? item.precio_venta  ?? 0),
  stock:        Number(item.stock ?? 0),
  estado:       item.estado === true || item.estado === 'true' || item.estado === 1 || item.estado === '1'
});

/**
 * Normaliza un producto de React para enviar a la REST API.
 * La API Node.js acepta tanto camelCase como snake_case, pero enviamos camelCase.
 */
const mapToBackend = (producto) => ({
  codigo:       producto.codigo,
  nombre:       producto.nombre,
  descripcion:  producto.descripcion,
  laboratorio:  producto.laboratorio,
  precioCompra: Number(producto.precioCompra),
  precioVenta:  Number(producto.precioVenta),
  stock:        Number(producto.stock),
  estado:       Boolean(producto.estado)
});

/**
 * Obtiene la lista completa de productos
 * @returns {Promise<Array>}
 */
export const obtenerProductos = async () => {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay();
    return getLocalStore().map(mapFromBackend);
  }

  // La API responde: { success: true, data: [...] }
  const response = await httpClient('/productos', { method: 'GET' });
  const lista = response?.data ?? response;
  return Array.isArray(lista) ? lista.map(mapFromBackend) : [];
};

/**
 * Obtiene un producto individual por su ID
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export const obtenerProductoPorId = async (id) => {
  const numericId = Number(id);

  if (USE_MOCK_DATA) {
    await simulateNetworkDelay();
    const productos = getLocalStore();
    const found = productos.find((p) => Number(p.id) === numericId);
    if (!found) {
      throw new Error(`Producto con ID ${id} no encontrado en el sistema.`);
    }
    return mapFromBackend(found);
  }

  // La API responde: { success: true, data: {...} }
  const response = await httpClient(`/productos/${id}`, { method: 'GET' });
  const item = response?.data ?? response;
  return mapFromBackend(item);
};

/**
 * Registra un nuevo producto en el sistema
 * @param {Object} producto
 * @returns {Promise<Object>} Producto creado con su ID generado
 */
export const crearProducto = async (producto) => {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay();
    const productos = getLocalStore();

    // Generar nuevo ID
    const maxId = productos.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
    const nuevoProducto = {
      ...producto,
      id: maxId + 1,
      precioCompra: Number(producto.precioCompra),
      precioVenta:  Number(producto.precioVenta),
      stock:        Number(producto.stock),
      estado:       Boolean(producto.estado)
    };

    const actualizados = [nuevoProducto, ...productos];
    saveLocalStore(actualizados);
    return mapFromBackend(nuevoProducto);
  }

  const payload = mapToBackend(producto);
  // La API responde: { success: true, data: {...} }
  const response = await httpClient('/productos', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  const item = response?.data ?? response;
  return mapFromBackend(item);
};

/**
 * Actualiza los datos de un producto existente
 * @param {number|string} id
 * @param {Object} producto
 * @returns {Promise<Object>}
 */
export const actualizarProducto = async (id, producto) => {
  const numericId = Number(id);

  if (USE_MOCK_DATA) {
    await simulateNetworkDelay();
    const productos = getLocalStore();
    const index = productos.findIndex((p) => Number(p.id) === numericId);

    if (index === -1) {
      throw new Error(`No se encontró el producto con ID ${id} para actualizar.`);
    }

    const productoActualizado = {
      ...productos[index],
      ...producto,
      id:           numericId,
      precioCompra: Number(producto.precioCompra),
      precioVenta:  Number(producto.precioVenta),
      stock:        Number(producto.stock),
      estado:       Boolean(producto.estado)
    };

    productos[index] = productoActualizado;
    saveLocalStore(productos);
    return mapFromBackend(productoActualizado);
  }

  const payload = mapToBackend({ ...producto, id: numericId });
  // La API responde: { success: true, data: {...} }
  const response = await httpClient(`/productos/${numericId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  const item = response?.data ?? response;
  return mapFromBackend(item);
};

/**
 * Elimina un producto por su ID
 * @param {number|string} id
 * @returns {Promise<boolean>}
 */
export const eliminarProducto = async (id) => {
  const numericId = Number(id);

  if (USE_MOCK_DATA) {
    await simulateNetworkDelay();
    const productos = getLocalStore();
    const filtrados = productos.filter((p) => Number(p.id) !== numericId);

    if (filtrados.length === productos.length) {
      throw new Error(`Producto con ID ${id} no encontrado para eliminar.`);
    }

    saveLocalStore(filtrados);
    return true;
  }

  // La API responde: { success: true, message: '...' } (sin data)
  await httpClient(`/productos/${numericId}`, { method: 'DELETE' });
  return true;
};
