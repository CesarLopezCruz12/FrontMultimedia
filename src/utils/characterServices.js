import apiClient from '../api/axiosConfig';

export const fetchPersonajes =  async() => {
    try {
      const { data } = await apiClient.get('/api/personajes?orden=fecha');
      return data;
    } catch (err) {
      console.error('Error al obtener personajes', err);
    }
  }

  export async function fetchCharacterDetail(characterID) {
    try {
      const { data } = await apiClient.get(`/api/bff/info/personajes/peliculas/${characterID}`);
      return data;
    } catch (err) {
      console.error('Error al obtener detalle de personaje', err);
      throw err;
    }
  }

  export async function deleteCharacter(id) {
    try {
      await apiClient.delete(`/api/personajes/${id}`);
    } catch (err) {
      console.error('Error eliminando personaje', err);
      throw err;
    }
  }

  /**
 * Crea un nuevo personaje con reparto y opción de imagen.
 * POST multipart → /api/bff/personajes/conreparto-with-image
 * @param {FormData} formData debe incluir:
 *   - data: JSON string con { nombre, descripcion, casting: [...] }
 *   - file: File (opcional)
 */
export async function createCharacterWithImage(formData) {
  try {
    const { data } = await apiClient.post(
      '/api/bff/personajes/conreparto-with-image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  } catch (err) {
    console.error('Error creando personaje con imagen', err);
    throw err;
  }
}

/**
 * Actualiza un personaje y sube una nueva imagen.
 * PUT multipart → /api/bff/personajes/with-image
 * @param {FormData} formData debe incluir:
 *   - data: JSON string con { personajeID, nombre, descripcion, casting: [...] }
 *   - file: File
 */
export async function updateCharacterWithImage(formData) {
  try {
    const { data } = await apiClient.put('/api/bff/personajes/with-image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  } catch (err) {
    console.error('Error actualizando personaje con imagen', err);
    throw err;
  }
}




/**
 * Actualiza personaje + reparto sin manejar archivo.
 * PUT /api/bff/personajes/conreparto
 * @param {number} personajeID 
 * @param {{ nombre: string, imagen: string, descripcion: string, casting: Array }} payload
 */
export async function updateCharacterWithCast(personajeID, payload) {
  try {
    // Construye el body incluyendo el personajeID
    const body = { personajeID, ...payload };
    const { data } = await apiClient.put(
      '/api/bff/personajes/conreparto',
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  } catch (err) {
    console.error('Error actualizando personaje con reparto', err);
    throw err;
  }
}