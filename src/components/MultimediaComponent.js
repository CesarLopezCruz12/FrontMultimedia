// src/components/MultimediaComponent.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies              from 'js-cookie';
import { fetchMultimedia }  from '../utils/multimediaServices';

export default function MultimediaComponent() {
  const navigate = useNavigate();

  // estados de filtros
  const [orden, setOrden]       = useState('fecha');
  const [tipo, setTipo]         = useState('');   // '' = todos
  const [q, setQ]               = useState('');
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Cargar datos cada que cambie orden, tipo o q
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchMultimedia({ orden, tipo, q })
      .then(data => setItems(data || []))
      .catch(() => setError('No se pudieron cargar las series o películas'))
      .finally(() => setLoading(false));
  }, [orden, tipo, q]);

  const handleEdit = (id) => {
    const token = Cookies.get('token');
    const path  = `/edit/multimedia/${id}`;
    if (token) navigate(path);
    else       navigate('/login', { state: { from: path } });
  };

  if (loading) return <div>Cargando contenido...</div>;
  if (error)   return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Multimedia Destacada</h2>

      {/* Controles de filtro */}
      <div className="flex space-x-4 mb-6 items-center">
        {/* Orden */}
        <label className="flex items-center space-x-2">
          <span>Orden:</span>
          <select
            value={orden}
            onChange={e => setOrden(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="fecha">Fecha (nuevas primero)</option>
            <option value="titulo">Título (A→Z)</option>
          </select>
        </label>

        {/* Tipo */}
        <label className="flex items-center space-x-2">
          <span>Tipo:</span>
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            <option value="1">Película</option>
            <option value="2">Serie</option>
          </select>
        </label>

        {/* Búsqueda */}
        <label className="flex items-center space-x-2 flex-1">
          <span>Búsqueda:</span>
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Título..."
            className="flex-1 border rounded px-2 py-1"
          />
        </label>
      </div>

      {/* Grilla */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div
            key={item.multimediaID}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            {item.imagen && (
              <img
                src={item.imagen}
                alt={item.titulo}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{item.titulo}</h3>
                <p className="text-gray-600 text-sm">{item.descripcion}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Link
                  to={`/multimedia/${item.multimediaID}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver detalle
                </Link>
                <button
                  onClick={() => handleEdit(item.multimediaID)}
                  className="text-sm text-green-600 hover:underline"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
