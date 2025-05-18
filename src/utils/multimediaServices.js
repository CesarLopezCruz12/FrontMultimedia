import apiClient from '../api/axiosConfig';

export const fetchMultimedia = async ({ orden, tipo, q } = {}) => {
  const params = new URLSearchParams();
  if (orden) params.set('orden', orden);
  if (tipo)  params.set('tipoMultimediaID', tipo);
  if (q)     params.set('q', q);

  try {
    const { data } = await apiClient.get(`/api/peliculas?${params.toString()}`);
    return data;
  } catch (err) {
    console.error('Error al obtener la multimedia', err);
    throw err;
  }
};
  
export const fetchMultimediaID = async (id) => {
    try {
      const { data } = await apiClient.get(`/api/peliculas/${id}`);
      return data;
    } catch (err) {
      console.error('Error al obtener la multimedia', err);
    }
  };

  export async function deleteMultimedia(id) {
    try {
      await apiClient.delete(`/api/peliculas/${id}`);
    } catch (err) {
      console.error('Error eliminando multimedia', err);
      throw err;
    }
  }

  export async function fetchMultimediaDetail(id) {
    console.log(id);
    try {
      const { data } = await apiClient.get(`/api/bff/info/peliculas/reparto/${id}`);
      return data;
    } catch (err) {
      console.error('Error al obtener detalle de multimedia', err);
      throw err;
    }
  }


  export async function updateMultimediaNoImage(id, payload) {
    
    try {
      const { data } = await apiClient.put(`/api/peliculas/${id}`, payload);
      return data;
    } catch (err) {
      console.error('Error actualizando multimedia sin imagen', err);
      throw err;
    }
  }

 
export async function updateMultimediaWithImage(formData) {
    try {
      const { data } = await apiClient.put('/api/bff/peliculas/with-image',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data;
    } catch (err) {
      console.error('Error actualizando multimedia con imagen', err);
      throw err;
    }
  }


/**
 * Crea nueva multimedia subiendo imagen
 * @param {FormData} formData debe contener:
 *   - data: JSON string con { tipoMultimediaID, titulo, descripcion }
 *   - file: File
 */
export async function createMultimediaWithImage(formData) {
    try {
      const { data } = await apiClient.post(
        '/api/bff/peliculas/with-image',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data;
    } catch (err) {
      console.error('Error creando multimedia con imagen', err);
      throw err;
    }
  }