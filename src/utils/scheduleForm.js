import React from 'react';

const ScheduleForm = ({ selectedItem, onClose }) => {
  if (!selectedItem) return null;

const handleSubmit = async (event) => {
  event.preventDefault();
  const name = event.target.name.value;
  const datainicio = event.target.dataInicio.value;
  const cargo = event.target.cargo.value;
  
  try{
    await window.electron.updateData(
      selectedItem.id, name, datainicio, cargo) 
      onClose();
      window.location.reload(); 

  } catch (error) {
     console.error('Erro ao atualizar os dados: ', error);
  }
};

  return (
    <div className="form-popup">
      <h2>Definir Horário para {selectedItem.name}</h2>
      <form onSubmit={handleSubmit}>
      <label>
          Nome do funcionário:
          <input type="text" name="name" />
        </label>
        <br />
        <label>
          Data Início:
          <input type="date" name="dataInicio" />
        </label>
        <br />
        <label>
          Cargo:
          <input type="text" name="cargo" />
        </label>
        <br />
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default ScheduleForm;