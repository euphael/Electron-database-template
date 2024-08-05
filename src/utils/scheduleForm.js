import React, { useState, useEffect } from 'react';

const ScheduleForm = ({ selectedItem, onClose }) => {
  const [cargos, setCargos] = useState([]);

  // Função que busca cargos existentes
  const fetchCargos = async () => {
    try {
      const cargos = await window.electron.selectCargos()
      setCargos(cargos)
    } catch (error) {
      console.error('Erro ao buscar cargos: ', error)
    }
  }

  // Carregar os cargos quando o componente for montado
  useEffect(() => {
    fetchCargos();
  }, []);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const datainicio = event.target.dataInicio.value;
    const cargo = event.target.cargo.value;

    try {
      // Verificação adicionada para determinar se estamos atualizando um item existente ou criando um novo
      if (selectedItem) {
        //Atualizar item existente
        await window.electron.updateData(selectedItem.id, name, datainicio, cargo);
      }

      else {
        // Criar novo item
        await window.electron.createData(name, datainicio, cargo);
      }
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar os dados: ', error);
    }
  };

  return (
    <div className="form-popup">
      <h2>{selectedItem ? `Definir horário para ${selectedItem.name}` : 'Cadastrar novo funcionário'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome do funcionário:
          <input type="text" name="name" defaultValue={selectedItem ? selectedItem.name : ''} />
        </label>
        <br />
        <label>
          Data Início:
          <input type="date" name="dataInicio" defaultValue={selectedItem ? selectedItem.dataInicio : ''} />
        </label>
        <br />
        <label>
          Cargo:
          <select name="cargo" defaultValue={selectedItem ? selectedItem.cargo : ''}>
            {cargos.map(cargo => (
              <option key={cargo.id} value={cargo.name}>
                {cargo.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default ScheduleForm;