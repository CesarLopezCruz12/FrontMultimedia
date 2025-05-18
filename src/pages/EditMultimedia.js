// src/pages/EditMultimedia.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MultimediaForm from '../components/MultimediaForm';
import { fetchMultimediaDetail } from '../utils/multimediaServices';

export default function EditMultimedia() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (id === 'new') {
      // Creación: formulario en blanco
      setInitialData({
        multimediaID:     null,
        tipoMultimediaID: 1,
        titulo:           '',
        descripcion:      '',
        imagen:           ''
      });
    } else {
      // Edición: cargar datos existentes
      fetchMultimediaDetail(id).then(data => {
         const { pelicula } = data;    // aquí sí existe el wrapper
              setInitialData({
                multimediaID:     pelicula.multimediaID,
                tipoMultimediaID: pelicula.tipoMultimediaID,
                titulo:           pelicula.titulo,
                descripcion:      pelicula.descripcion,
                imagen:           pelicula.imagen
              });
            });
    }
  }, [id]);

  if (!initialData) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {id === 'new' ? 'Crear Multimedia' : 'Editar Multimedia'}
      </h1>
      <MultimediaForm initialData={initialData} isEdit={id !== 'new'} />
    </div>
  );
}
