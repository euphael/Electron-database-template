window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFuncionarios: () => ipcRenderer.invoke('select-funcionarios'),
  selectCargos: () => ipcRenderer.invoke('select-cargos'),
  updateData: (id, name, dataInicio, horasPositivas, horasNegativas, cargo) => ipcRenderer.invoke('update-data', id, name, dataInicio, horasPositivas, horasNegativas, cargo),
  createData: (name, dataInicio, horasPositivas, horasNegativas, cargo) => ipcRenderer.invoke('create-data', name, dataInicio, horasPositivas, horasNegativas, cargo),
  deleteData: (id) => ipcRenderer.invoke('delete-data', id),
  selectFuncionariosByCargo: (cargo) => ipcRenderer.invoke('select-funcionarios-by-cargo', cargo) 
});