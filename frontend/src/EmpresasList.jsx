import { useEffect, useState } from 'react';

function EmpresasList() {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/empresas')
      .then((res) => res.json())
      .then((data) => setEmpresas(data))
      .catch((err) => console.error('Error al cargar empresas:', err));
  }, []);

  if (empresas.length === 0) {
    return <p style={{ color: 'white' }}>Cargando empresas...</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
      <thead>
        <tr>
          <th style={estiloTH}>RUT</th>
          <th style={estiloTH}>Tipo de Evento</th>
          <th style={estiloTH}>Archivo</th>
          <th style={estiloTH}>Capital</th>
        </tr>
      </thead>
      <tbody>
        {empresas.map((empresa) => (
          <tr key={empresa._id}>
            <td style={estiloTD}>{empresa.rut}</td>
            <td style={estiloTD}>{empresa.tipo_evento}</td>
            <td style={estiloTD}>{empresa.archivo}</td>
            <td style={estiloTD}>{empresa.capital || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
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
