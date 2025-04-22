import { useState } from 'react';

function RegisterModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email.includes('@')) return alert('Correo inválido');
    if (password.length < 6) return alert('Contraseña debe tener al menos 6 caracteres');

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Usuario registrado correctamente');
        onClose(); // cerrar el modal
      } else {
        alert(data.error || 'Error al registrar');
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 0 15px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '350px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Registro</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', marginBottom: '1.5rem', padding: '0.5rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit" style={{ padding: '0.5rem 1rem' }}>Registrar</button>
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem' }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
