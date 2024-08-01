import React, { useState } from 'react';
import ScheduleForm from './scheduleForm';

const DataTable = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleButtonClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseForm = () => {
    setSelectedItem(null);
  };

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
            <th>Ações</th>
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
              <td>
                <button onClick={() => handleButtonClick(item)}>
                  Definir Horário
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ScheduleForm selectedItem={selectedItem} onClose={handleCloseForm} />
    </div>
  );
};

export default DataTable;