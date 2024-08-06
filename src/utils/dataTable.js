import React, { useState, useEffect } from 'react';
import ScheduleForm from './scheduleForm';
import moment from 'moment';

const DataTable = ({ addFunc }) => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [cargos, setCargos] = useState([]);
  const [selectedCargo, setSelectedCargo] = useState('');

  useEffect(() => {
    // Busca todos os cargos
    window.electron.selectCargos().then((results) => {
      setCargos(results);
    }).catch((error) => {
      console.error('Erro ao buscar cargos:', error);
    });
  }, []);

  useEffect(() => {
    if (selectedCargo) {
      // Buscar funcionários pelo cargo selecionado
      window.electron.selectFuncionariosByCargo(selectedCargo).then((results) => {
        setData(results);
      }).catch((error) => {
        console.error('Erro ao buscar dados:', error);
      });
    } else {
      // Buscar todos os funcionários se nenhum cargo estiver selecionado
      window.electron.selectFuncionarios().then((results) => {
        setData(results);
      }).catch((error) => {
        console.error('Erro ao buscar dados:', error);
      });
    }
  }, [selectedCargo]);

  const insertButton = async (newFunc) => {
    try {
      await addFunc(newFunc); // Chama a função para adicionar o novo funcionário
      setIsRegistering(false); // Fecha o formulário de cadastro
      window.location.reload(); // Atualiza a página automaticamente
    } catch (error) {
      console.error("Erro ao adicionar funcionário.", error);
    }
  };

  const updateButton = (item) => {
    setSelectedItem(item);
    setIsRegistering(false); // Garante que o formulário de cadastro não esteja aberto
  };

  const deleteButton = async (item) => {
    if (window.confirm(`Tem certeza que deseja deletar o funcionário ${item.name}?`)) {
      try {
        await window.electron.deleteData(item.id);
        window.location.reload();
      } catch (error) {
        console.error("Erro ao deletar.", error);
      }
    }
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

      <div>
        <label htmlFor="cargo-select">Selecione o Cargo: </label>
        <select
          id="cargo-select"
          value={selectedCargo}
          onChange={(e) => setSelectedCargo(e.target.value)}
        >
          <option value="">Todos</option>
          {cargos.map((cargo) => (
            <option key={cargo.id} value={cargo.name}>
              {cargo.name}
            </option>
          ))}
        </select>
      </div>
      <br />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Data inicio</th>
            <th>Horas positivas</th>
            <th>Horas negativas</th>
            <th>Total de horas</th>
            <th>Cargo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const horasPositivas = moment.duration(item.horasPositivas);
            const horasNegativas = moment.duration(item.horasNegativas);
            const diferenca = horasPositivas.subtract(horasNegativas);

            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.dataInicio}</td>
                <td>{item.horasPositivas}</td>
                <td>{item.horasNegativas}</td>
                <td>{`${diferenca.hours()}:${diferenca.minutes()}`}</td>
                <td>{item.cargo}</td>
                <td>
                  <button className="update-button" onClick={() => updateButton(item)}>
                    Editar
                  </button>
                </td>
                <td>
                  <button className="delete-button" onClick={() => deleteButton(item)}>
                    Deletar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isRegistering && (
        <ScheduleForm onSubmit={insertButton} onClose={handleCloseForm} />
      )}

      {selectedItem && !isRegistering && (
        <ScheduleForm selectedItem={selectedItem} onSubmit={insertButton} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default DataTable;