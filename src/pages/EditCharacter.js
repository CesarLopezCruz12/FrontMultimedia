// src/pages/EditCharacter.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import CharacterForm from '../components/CharacterForm';          // ← Asegúrate de esto
import { fetchCharacterDetail } from '../utils/characterServices';
import { fetchMultimedia }       from '../utils/multimediaServices';

export default function EditCharacter() {
  const { id } = useParams();
  const [initialData, setInitialData]   = useState(null);
  const [mediaOptions, setMediaOptions] = useState([]);

  useEffect(() => {
    // Cargo todas las películas para el select
    fetchMultimedia()
      .then(data => setMediaOptions(data || []))
      .catch(console.error);

    // Cargo el detalle si no es "new"
    if (id !== 'new') {
      fetchCharacterDetail(id)
        .then(data => {
          setInitialData({
            personajeID: data.personaje.personajeID,
            nombre:      data.personaje.nombre,
            descripcion: data.personaje.descripcion,
            imagen:      data.personaje.imagen,
            reparto:     data.reparto
          });
        })
        .catch(console.error);
    } else {
      // Crear: estado vacío
      setInitialData({
        personajeID: null,
        nombre:      '',
        descripcion: '',
        imagen:      '',
        reparto:     []
      });
    }
  }, [id]);

  // Mientras no estén listos initialData o mediaOptions
  if (!initialData || mediaOptions.length === 0) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {id === 'new' ? 'Crear Personaje' : 'Editar Personaje'}
      </h1>

      <CharacterForm
        initialData={initialData}
        mediaOptions={mediaOptions}
        isEdit={id !== 'new'}
      />
    </div>
  );
}
