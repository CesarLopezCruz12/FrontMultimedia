import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import PublicDashboard   from './pages/PublicDashboard';
import MultimediaDetail  from './pages/MultimediaDetail';
import CharacterDetail   from './pages/CharacterDetail';
import EditMultimedia    from './pages/EditMultimedia';
import EditCharacter     from './pages/EditCharacter';
import Login             from './pages/Login';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de dashboard: solo para "/" */}
        <Route path="/" element={<PublicDashboard />} />

        {/* Ahora las rutas de detalle NO están dentro de "/" */}
        <Route path="/multimedia/:id" element={<MultimediaDetail />} />
        <Route path="/personaje/:id"  element={<CharacterDetail  />} />

        {/* Rutas de edición y login */}
        <Route path="/login"               element={<Login          />} />
        <Route path="/edit/multimedia/:id" element={<EditMultimedia />} />
        <Route path="/edit/personaje/:id"  element={<EditCharacter  />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
