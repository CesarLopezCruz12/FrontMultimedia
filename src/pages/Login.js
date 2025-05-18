// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginService } from '../utils/authServices';

export default function Login() {
  const nav      = useNavigate();
  const location = useLocation();
  const from     = location.state?.from || '/';

  const [user, setUser]   = useState('');
  const [pass, setPass]   = useState('');
  const [error, setError] = useState('');

  const handle = async e => {
    e.preventDefault();
    setError('');
    const ok = await loginService(user, pass);
    if (ok) {
      // si venimos de editar, from contendrá /edit/…
      nav(from, { replace: true });
    } else {
      setError('Usuario o contraseña inválidos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handle} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          className="w-full mb-3 p-2 border rounded"
          value={user}
          onChange={e => setUser(e.target.value)}
          placeholder="Usuario"
          required
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
