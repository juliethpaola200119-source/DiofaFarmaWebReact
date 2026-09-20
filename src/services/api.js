/**
 * Centralización de la configuración de peticiones HTTP en DioFaFarma.
 * 
 * Permite alternar fácilmente entre datos simulados (Mock) y el backend Java en:
 * http://localhost:8080/diofafarma/api
 */

// URL base del backend Java (Servlet / Spring / REST)
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/diofafarma/api';

// Configuración de modo simulado (por defecto true mientras se desarrolla el backend Java)
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK !== 'false';

/**
 * Cliente HTTP base para realizar peticiones JSON a la API REST de Java.
 * 
 * @param {string} endpoint - Ruta relativa, ej: '/productos'
 * @param {RequestInit} options - Opciones de fetch (method, headers, body)
 * @returns {Promise<any>} Respuesta JSON parseada
 */
export const httpClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
      } catch {
        // En caso de que la respuesta no sea JSON
      }
      throw new Error(errorMessage);
    }

    // Si la respuesta no tiene contenido (ej. HTTP 204 No Content en DELETE)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Error] Error en llamada a ${url}:`, error);
    throw error;
  }
};
