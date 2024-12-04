import React, { useEffect, useState } from 'react';
import './App.css';
import DataTable from './utils/dataTable';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    window.electron.selectFuncionarios().then((results) => {
      setData(results);
    }).catch((error) => {
      console.error('Erro ao buscar dados:', error);
    });
  }, []);

  return (
    <div className="App">
     <DataTable data={data} />
    </div>
  );
}