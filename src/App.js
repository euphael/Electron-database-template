import React, { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    window.electron.fetchData().then((results) => {
      setData(results);
    }).catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
  }, []);

  return (
    <div className="App">
      <h1>Dados do Banco de Dados</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}