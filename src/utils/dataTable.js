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
      <h1>Dados dos funcionários</h1>

      <button className="register-button" onClick={() => '#default'}>
        Cadastrar funcionário
      </button>

      <br /> 
      <br /> 

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Data inicio</th>
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
              <td>{item.cargo}</td>
              <td>
                <button className="update-button" onClick={() => handleButtonClick(item)}>
                  Editar
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