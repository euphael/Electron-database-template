import React from 'react';

const ScheduleForm = ({ selectedItem, onClose }) => {
  if (!selectedItem) return null;

  return (
    <div className="form-popup">
      <h2>Definir Horário para {selectedItem.name}</h2>
      <form>
        <label>
          Data Início:
          <input type="date" name="dataInicio" />
        </label>
        <br />
        <label>
          Data Fim:
          <input type="date" name="dataFim" />
        </label>
        <br />
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default ScheduleForm;