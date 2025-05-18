// src/components/CharacterComponent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { fetchPersonajes } from '../utils/characterServices';

export default function CharacterComponent() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPersonajes();
        setCharacters(data || []);
      } catch {
        setError('No se pudieron cargar los personajes');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleEdit = (id) => {
    const editPath = `/edit/personaje/${id}`;
    const token = Cookies.get('token');
    if (token) {
      navigate(editPath);
    } else {
      navigate('/login', { state: { from: editPath } });
    }
  };

  if (loading) return <div>Cargando personajes...</div>;
  if (error)   return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Personajes Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((char) => (
          <div
            key={char.personajeID}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            {char.imagen && (
              <img
                src={char.imagen}
                alt={char.nombre}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{char.nombre}</h3>
                <p className="text-gray-600 text-sm">{char.descripcion}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => navigate(`/personaje/${char.personajeID}`)}
                className="text-sm text-blue-600 hover:underline"
              >
                Ver detalle
              </button>

                <button
                  onClick={() => handleEdit(char.personajeID)}
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
