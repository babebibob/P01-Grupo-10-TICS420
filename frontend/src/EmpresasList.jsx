import { useEffect, useState } from 'react';

function EmpresasList() {
  const [empresas, setEmpresas] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/empresas')
      .then((res) => res.json())
      .then((data) => setEmpresas(data))
      .catch((err) => console.error('❌ Error al cargar empresas:', err));
  }, []);

  const empresasFiltradas = empresas.filter((e) => {
    const filtroLower = filtro.toLowerCase();
    return (
      e.rut?.toLowerCase().includes(filtroLower) ||
      e.razon_social?.toLowerCase().includes(filtroLower)
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por RUT o Razón Social..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{
          padding: '0.5rem',
          marginBottom: '1rem',
          width: '100%',
          fontSize: '1rem',
        }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
        <thead>
          <tr>
            <th style={estiloTH}>RUT</th>
            <th style={estiloTH}>Razón Social</th>
            <th style={estiloTH}>Tipo de Evento</th>
            <th style={estiloTH}>Archivo</th>
            <th style={estiloTH}>Capital</th>
          </tr>
        </thead>
        <tbody>
          {empresasFiltradas.map((empresa) => (
            <tr key={empresa._id}>
              <td style={estiloTD}>{empresa.rut}</td>
              <td style={estiloTD}>{empresa.razon_social || '—'}</td>
              <td style={estiloTD}>{empresa.tipo_evento}</td>
              <td style={estiloTD}>{empresa.archivo}</td>
              <td style={estiloTD}>{empresa.capital || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const estiloTH = {
  border: '1px solid white',
  padding: '0.5rem',
  backgroundColor: '#222',
};

const estiloTD = {
  border: '1px solid white',
  padding: '0.5rem',
  textAlign: 'center',
};

export default EmpresasList;
