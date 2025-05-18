// src/components/MultimediaForm.jsx
import React, { useState } from 'react';
import {
  createMultimediaWithImage,
  updateMultimediaNoImage,
  updateMultimediaWithImage
} from '../utils/multimediaServices';

export default function MultimediaForm({ initialData = {}, isEdit = false }) {
  const [data, setData] = useState({
    multimediaID:     initialData.multimediaID    || null,
    tipoMultimediaID: initialData.tipoMultimediaID|| 1,
    titulo:           initialData.titulo          || '',
    descripcion:      initialData.descripcion     || '',
    imagen:           initialData.imagen          || ''
  });
  const [file, setFile] = useState(null);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let result;

      if (!isEdit) {
        // === CREACIÓN ===
        // formData con JSON y file
        const form = new FormData();
        form.append('data', JSON.stringify({
          tipoMultimediaID: data.tipoMultimediaID,
          titulo:           data.titulo,
          descripcion:      data.descripcion
        }));
        if (file) form.append('file', file);

        result = await createMultimediaWithImage(form);
        setSuccess('Multimedia creada correctamente');
      } else if (!file) {
        // === ACTUALIZACIÓN sin cambiar imagen ===
        result = await updateMultimediaNoImage(data.multimediaID, {
          tipoMultimediaID: data.tipoMultimediaID,
          titulo:           data.titulo,
          imagen:           data.imagen,
          descripcion:      data.descripcion
        });
        setSuccess('Multimedia actualizada (sin imagen)');
      } else {
        // === ACTUALIZACIÓN con nueva imagen ===
        const form = new FormData();
        form.append('data', JSON.stringify({
          multimediaID:     data.multimediaID,
          tipoMultimediaID: data.tipoMultimediaID,
          titulo:           data.titulo,
          descripcion:      data.descripcion
        }));
        form.append('file', file);

        result = await updateMultimediaWithImage(form);
        setSuccess('Multimedia actualizada (con imagen)');
      }

      // Opcional: si quieres, puedes limpiar o redirigir aquí:
      // navigate('/edit/multimedia/' + result.multimediaID);
    } catch {
      setError('Error al guardar la multimedia');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      {isEdit && data.imagen && (
        <div>
          <label className="block mb-1">Imagen actual:</label>
          <img
            src={data.imagen}
            alt="Preview"
            className="w-32 h-32 object-cover rounded mb-4"
          />
        </div>
      )}

      <div>
        <label className="block mb-1">Subir imagen{isEdit ? ' nueva (opcional)' : ''}:</label>
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          className="w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Tipo</label>
        <select
            value={data.tipoMultimediaID}
            onChange={e =>
            setData(d => ({
                ...d,
                tipoMultimediaID: parseInt(e.target.value, 10)
            }))
            }
            required
            className="w-full border p-2 rounded"
        >
            <option value={1}>PELÍCULA</option>
            <option value={2}>SERIE</option>
        </select>
    </div>

      <div>
        <label className="block mb-1">Título</label>
        <input
          value={data.titulo}
          onChange={e => setData(d => ({ ...d, titulo: e.target.value }))}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Descripción</label>
        <textarea
          value={data.descripcion}
          onChange={e => setData(d => ({ ...d, descripcion: e.target.value }))}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {isEdit
          ? (!file ? 'Actualizar sin imagen' : 'Actualizar con imagen')
          : 'Crear Multimedia'}
      </button>
    </form>
  );
}
