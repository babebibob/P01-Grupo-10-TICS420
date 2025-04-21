// frontend/src/components/RegisterModal.jsx
import { useState } from 'react';
import './RegisterModal.css'; // opcional: estilos propios

function RegisterModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!email.includes('@')) {
      setMensaje('El correo debe incluir un @');
      return;
    }

    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setMensaje(data.error || 'Error en el registro');
        return;
      }

      alert('Usuario registrado correctamente');
      onClose(); // cerrar modal
    } catch (err) {
      console.error('Error de red:', err);
      setMensaje('Error al registrar usuario');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Registrar Usuario</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña (mínimo 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
          <div style={{ marginTop: '1rem' }}>
            <button type="submit">Registrar</button>
            <button type="button" onClick={onClose} style={{ marginLeft: '1rem' }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
