// App.jsx
import { useState, useEffect } from 'react';
import EmpresasList from './components/CompaniesList';
import LoginForm from './components/LoginForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h1 style={{ marginBottom: '2rem' }}>Company Processor</h1>

      {isLoggedIn ? (
        <>
          <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>
            Logout
          </button>
          <EmpresasList />
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
