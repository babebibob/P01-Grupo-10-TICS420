import { useEffect, useState } from 'react';

function ObjetoModal({ objeto, onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', padding: '1.5rem', maxWidth: '600px', borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)', maxHeight: '80%', overflowY: 'auto'
      }}>
        <h3>Objeto</h3>
        <p style={{ whiteSpace: 'pre-line' }}>{objeto}</p>
        <button onClick={onClose} style={{
          marginTop: '1rem', padding: '6px 12px', backgroundColor: '#333', color: 'white',
          border: 'none', borderRadius: '4px', cursor: 'pointer'
        }}>Cerrar</button>
      </div>
    </div>
  );
}

function CompaniesList() {
  const [empresas, setEmpresas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [modalObjeto, setModalObjeto] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/companies')
      .then(res => res.json())
      .then(data => {
        console.log("✅ Datos recibidos:", data);
        setEmpresas(data);
      })
      .catch(err => console.error('❌ Error al cargar empresas:', err));
  }, []);

  const empresasFiltradas = empresas.filter((e) => {
    const filtroLower = filtro.toLowerCase();
    return (
      (e.rut || '').toLowerCase().includes(filtroLower) ||
      (e.razon_social || '').toLowerCase().includes(filtroLower)
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por RUT o Razón Social..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#222', color: 'white' }}>
            <th>RUT</th>
            <th>Razón Social</th>
            <th>Tipo de Evento</th>
            <th>Archivo</th>
            <th>Capital</th>
            <th>Objeto</th>
          </tr>
        </thead>
        <tbody>
          {empresasFiltradas.map((empresa, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{empresa.rut || '—'}</td>
              <td>{empresa.razon_social || '—'}</td>
              <td>{empresa.tipo_evento || '—'}</td>
              <td>{empresa.archivo || '—'}</td>
              <td>{empresa.capital || '—'}</td>
              <td>
                {empresa.objeto ? (
                  <button
                    onClick={() => setModalObjeto(empresa.objeto)}
                    style={{
                      backgroundColor: '#333', color: 'white', border: 'none',
                      padding: '4px 8px', borderRadius: '4px', cursor: 'pointer'
                    }}
                  >
                    Ver
                  </button>
                ) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalObjeto && (
        <ObjetoModal objeto={modalObjeto} onClose={() => setModalObjeto(null)} />
      )}
    </div>
  );
}

export default CompaniesList;
