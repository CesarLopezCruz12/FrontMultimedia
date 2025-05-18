// src/components/CharacterForm.jsx
import React, { useState, useEffect } from 'react';
import {
  createCharacterWithImage,
  updateCharacterWithCast,
  updateCharacterWithImage
} from '../utils/characterServices';

export default function CharacterForm({
  initialData,
  mediaOptions,
  isEdit
}) {
  // Datos básicos
  const [data, setData] = useState({
    personajeID: initialData.personajeID  || null,
    nombre:      initialData.nombre       || '',
    descripcion: initialData.descripcion  || '',
    imagenUrl:   initialData.imagen       || ''
  });
  const [file, setFile]       = useState(null);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  // Reparto existente
  const [reparto, setReparto] = useState(initialData.reparto || []);
  // Películas disponibles para añadir
  const [available, setAvailable] = useState([]);
  useEffect(() => {
    const used = new Set(reparto.map(r => r.multimediaID));
    setAvailable(mediaOptions.filter(m => !used.has(m.multimediaID)));
  }, [mediaOptions, reparto]);

  const [toAdd, setToAdd] = useState('');

  const addReparto = () => {
    if (!toAdd) return;
    setReparto(rs => [
      ...rs,
      { multimediaID: Number(toAdd), rol: '', descripcion: '' }
    ]);
    setToAdd('');
  };
  const updateReparto = (i, f, v) => {
    setReparto(rs => {
      const c = [...rs];
      c[i][f] = v;
      return c;
    });
  };
  const removeReparto = i => {
    setReparto(rs => rs.filter((_, idx) => idx !== i));
  };

  // Envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');

    try {
      let res;
      if (!isEdit) {
        // ==== CREAR ====
        const form = new FormData();
        form.append('data', JSON.stringify({
          nombre:      data.nombre,
          descripcion: data.descripcion,
          casting:     reparto
        }));
        if (file) form.append('file', file);
        res = await createCharacterWithImage(form);
        setSuccess('Personaje creado correctamente');
      } else if (!file) {
        // ==== ACTUALIZAR SIN IMAGEN ====
        res = await updateCharacterWithCast(data.personajeID, {
          nombre:      data.nombre,
          imagen:      data.imagenUrl,
          descripcion: data.descripcion,
          casting:     reparto
        });
        setSuccess('Personaje actualizado correctamente');
      } else {
        // ==== ACTUALIZAR CON IMAGEN ====
        const form = new FormData();
        form.append('data', JSON.stringify({
          personajeID: data.personajeID,
          nombre:      data.nombre,
          descripcion: data.descripcion,
          casting:     reparto
        }));
        form.append('file', file);
        res = await updateCharacterWithImage(form);
        setSuccess('Personaje actualizado con imagen');
      }
      // opcional: actualizar data/reparto con res…
    } catch (err) {
      console.error(err);
      setError('Error al guardar el personaje');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Campos básicos */}
      <div>
        <label className="block mb-1">Nombre</label>
        <input
          className="w-full border p-2 rounded"
          value={data.nombre}
          onChange={e => setData(d => ({ ...d, nombre: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Descripción</label>
        <textarea
          className="w-full border p-2 rounded"
          value={data.descripcion}
          onChange={e => setData(d => ({ ...d, descripcion: e.target.value }))}
          required
        />
      </div>

      {/* Imagen */}
      {isEdit && data.imagenUrl && (
        <div>
          <label className="block mb-1">Imagen actual</label>
          <img
            src={data.imagenUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded mb-4"
          />
        </div>
      )}
      <div>
        <label className="block mb-1">
          Subir imagen {isEdit ? '(opcional)' : ''}
        </label>
        <input
          type="file"
          className="w-full"
          onChange={e => {
            setFile(e.target.files[0]);
            setData(d => ({ ...d, imagenUrl: '' }));
          }}
        />
      </div>

      {/* Reparto existente */}
      <div>
        <h2 className="font-medium mb-2">Reparto Actual</h2>
        {reparto.length === 0 && <p className="italic">Sin reparto asignado.</p>}
        <div className="space-y-4">
          {reparto.map((r, i) => {
            const movie = mediaOptions.find(m => m.multimediaID === r.multimediaID);
            return (
              <div key={i} className="flex items-start space-x-4 border p-4 rounded">
                <div className="w-1/4 font-semibold">{movie?.titulo}</div>
                <input
                  className="w-1/4 border p-1 rounded"
                  placeholder="Rol"
                  value={r.rol}
                  onChange={e => updateReparto(i, 'rol', e.target.value)}
                  required
                />
                <input
                  className="flex-1 border p-1 rounded"
                  placeholder="Descripción del rol"
                  value={r.descripcion}
                  onChange={e => updateReparto(i, 'descripcion', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeReparto(i)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Añadir reparto */}
      <div>
        <h2 className="font-medium mb-2">Añadir al reparto</h2>
        <div className="flex space-x-2">
          <select
            className="flex-1 border p-2 rounded"
            value={toAdd}
            onChange={e => setToAdd(e.target.value)}
          >
            <option value="">— Selecciona película —</option>
            {available.map(m => (
              <option key={m.multimediaID} value={m.multimediaID}>
                {m.titulo}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addReparto}
            disabled={!toAdd}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Añadir
          </button>
        </div>
      </div>

      {/* Mensajes y botón */}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {isEdit ? 'Actualizar Personaje' : 'Crear Personaje'}
      </button>
    </form>
  );
}
