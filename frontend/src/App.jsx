import { useState, useEffect } from 'react';
import EmpresasList from './components/CompaniesList'; // Component that displays the list of companies
import LoginForm from './components/LoginForm'; // New login component

function App() {
  // State to check if the user is logged in (based on token presence)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // On app load, check if a JWT token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Converts token to boolean (true if exists)
  }, []);

  // Called after successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Clears token and logs the user out
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Company Processor</h1>

      {isLoggedIn ? (
        // If the user is logged in, show logout button + company list
        <>
          <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>
            Logout
          </button>
          <EmpresasList />
        </>
      ) : (
        // If not logged in, show the login form
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
