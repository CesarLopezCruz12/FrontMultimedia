import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { fetchMultimediaDetail, deleteMultimedia } from '../utils/multimediaServices';

export default function MultimediaDetail() {
  const { id } = useParams();
  const nav    = useNavigate();

  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    setLoading(true);
    fetchMultimediaDetail(id)
      .then(res => setData(res))
      .catch(() => setError('No se pudo cargar el detalle'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    const path = `/edit/multimedia/${id}`;
    const token = Cookies.get('token');
    if (token) nav(path);
    else       nav('/login', { state: { from: path } });
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta multimedia?')) return;
    try {
      await deleteMultimedia(id);
      nav('/');
    } catch {
      alert('Error al eliminar');
    }
  };

  if (loading) return <div>Cargando detalle…</div>;
  if (error)   return <div className="text-red-500">{error}</div>;

  const { pelicula, reparto, personajes } = data;

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-3xl font-bold">{pelicula.titulo}</h1>
      {pelicula.imagen && (
        <img
          src={pelicula.imagen}
          alt={pelicula.titulo}
          className="w-full h-64 object-cover rounded my-4"
        />
      )}
      <p className="text-gray-700">{pelicula.descripcion}</p>

      <section>
        <h2 className="text-2xl font-semibold mt-6">Reparto</h2>
        {reparto.length === 0 ? (
          <p className="italic">No hay reparto asignado.</p>
        ) : (
          <ul className="list-disc list-inside">
            {reparto.map(r => {
              const p = personajes.find(x => x.personajeID === r.personajeID);
              return (
                <li key={r.repartoID}>
                  <strong>{p?.nombre || `ID ${r.personajeID}`}</strong> — {r.rol}
                  {r.descripcion && `: ${r.descripcion}`}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="flex space-x-4 mt-8">
        <button
          onClick={handleEdit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
