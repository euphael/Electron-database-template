import React, { useState } from 'react';
import ScheduleForm from './scheduleForm';

const DataTable = ({ data, addFunc }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const insertButton = async (newFunc) => {
    try {
      await addFunc(newFunc); // Chama a função para adicionar o novo funcionário
      setIsRegistering(false); // Fecha o formulário de cadastro
      window.location.reload(); // Atualiza a página automaticamente
    } catch (error) {
      console.error("Erro ao adicionar funcionário.", error);
    }
  }; // Adiciona função para lidar com a submissão do novo funcionário

  const updateButton = (item) => {
    setSelectedItem(item);
    setIsRegistering(false); // Garante que o formulário de cadastro não esteja aberto
  };

  const handleCloseForm = () => {
    setSelectedItem(null);
    setIsRegistering(false); // Fecha o formulário de cadastro
  };

  return (
    <div className="DataTable">
      <h1>Dados dos funcionários</h1>

      <button className="register-button" onClick={() => setIsRegistering(true)}>
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
                <button className="update-button" onClick={() => updateButton(item)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isRegistering && (
        <ScheduleForm onSubmit={insertButton} onClose={handleCloseForm} />
      )}

      {selectedItem && !isRegistering && (
        <ScheduleForm selectedItem={selectedItem} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default DataTable;