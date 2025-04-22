import { useState } from 'react';
import RegisterModal from './RegisterModal';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes('@')) return alert('El correo debe contener un @');
    if (password.length < 6) return alert('La contraseña debe tener al menos 6 caracteres');

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        alert(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f2f2f2',
      zIndex: 1
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '350px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
        <form onSubmit={handleSubmit}>
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
            <button type="submit" style={{ padding: '0.5rem 1rem' }}>Login</button>
            <button type="button" onClick={() => setShowRegister(true)} style={{ padding: '0.5rem 1rem' }}>
              Register
            </button>
          </div>
        </form>

        {showRegister && (
          <RegisterModal onClose={() => setShowRegister(false)} />
        )}
      </div>
    </div>
  );
}

export default LoginForm;
