import { useState } from 'react';
import RegisterModal from './RegisterModal';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Login failed');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      onLogin();
    } catch (err) {
      alert('Error interno del servidor');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{
        border: '1px solid #ccc',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleLogin}>Login</button>
          <button onClick={() => setShowRegister(true)}>Register</button>
        </div>
      </div>

      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}
    </div>
  );
}

export default LoginForm;
