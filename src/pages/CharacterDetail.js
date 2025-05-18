import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }     from 'react-router-dom';
import Cookies                         from 'js-cookie';
import { fetchCharacterDetail, deleteCharacter } from '../utils/characterServices';

export default function CharacterDetail() {
  const { id }       = useParams();        // id de URL /personaje/:id
  const navigate     = useNavigate();

  const [detail, setDetail]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetchCharacterDetail(id)
      .then(setDetail)
      .catch(() => setError('No se pudo cargar el detalle del personaje'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    const path = `/edit/personaje/${id}`;
    const token = Cookies.get('token');
    if (token) navigate(path);
    else       navigate('/login', { state: { from: path } });
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este personaje?')) return;
    try {
      await deleteCharacter(id);
      navigate('/');
    } catch {
      alert('Error al eliminar el personaje');
    }
  };

  if (loading) return <div>Cargando detalle...</div>;
  if (error)   return <div className="text-red-500">{error}</div>;

  const { personaje, reparto, peliculas } = detail;

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Volver
      </button>

      <div className="flex flex-col md:flex-row bg-gray-50 rounded overflow-hidden">
        {personaje.imagen && (
          <img
            src={personaje.imagen}
            alt={personaje.nombre}
            className="w-full md:w-1/3 h-auto object-cover"
          />
        )}
        <div className="p-6 flex-1">
          <h1 className="text-2xl font-bold mb-2">{personaje.nombre}</h1>
          <p className="text-gray-700 mb-4">{personaje.descripcion}</p>
          <p className="text-sm text-gray-500">
            Creado el: {new Date(personaje.fechaCreacion).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Películas donde aparece</h2>
        {reparto.length === 0 ? (
          <p className="italic">Este personaje no aparece en ninguna película.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reparto.map((r) => {
              const movie = peliculas.find(m => m.multimediaID === r.multimediaID);
              return (
                <li key={r.repartoID} className="p-4 bg-white rounded shadow flex items-center">
                  {movie?.imagen && (
                    <img
                      src={movie.imagen}
                      alt={movie.titulo}
                      className="h-16 w-16 object-cover rounded mr-4"
                    />
                  )}
                  <div>
                    <p className="font-medium">{movie?.titulo}</p>
                    <p className="text-sm text-gray-600">{r.rol}</p>
                    {r.descripcion && <p className="text-sm text-gray-500">{r.descripcion}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

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
