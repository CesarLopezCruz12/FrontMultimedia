import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import CharacterComponent  from '../components/CharacterComponent';
import MultimediaComponent from '../components/MultimediaComponent';

export default function PublicDashboard() {
  const [activeTab, setActiveTab] = useState('multimedia');
  const navigate = useNavigate();

  const renderContent = () =>
    activeTab === 'multimedia'
      ? <MultimediaComponent />
      : <CharacterComponent />;

  const handleCreate = () => {
    const path =
      activeTab === 'multimedia'
        ? '/edit/multimedia/new'
        : '/edit/personaje/new';
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('personaje')}
              className={`pb-2 font-medium ${
                activeTab === 'personaje'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Personaje
            </button>
            <button
              onClick={() => setActiveTab('multimedia')}
              className={`pb-2 font-medium ${
                activeTab === 'multimedia'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Multimedia
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleCreate}
              className="text-sm text-green-600 hover:underline"
            >
              {activeTab === 'multimedia' ? 'Crear multimedia' : 'Crear personaje'}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:underline"
            >
              Iniciar Sesión
            </button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Aquí va tu grid de MultimediaComponent o CharacterComponent */}
        {renderContent()}

        {/* Este Outlet renderiza las rutas hijas /multimedia/:id o /personaje/:id */}
        <Outlet />
      </main>
    </div>
  );
}


