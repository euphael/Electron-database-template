import React from 'react';

const DataTable = ({ data }) => {
  return (
    <div className="DataTable">
      <h1>Dados do Banco de Dados</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Data inicio</th>
            <th>Data fim</th>
            <th>Cargo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.dataInicio}</td>
              <td>{item.dataFim}</td>
              <td>{item.cargo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;