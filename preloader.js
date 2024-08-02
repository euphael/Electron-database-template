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
  fetchData: () => ipcRenderer.invoke('fetch-data'),
  updateData: (id, name, dataInicio, cargo) => ipcRenderer.invoke('update-data', id, name, dataInicio, cargo),
  createData: (name, dataInicio, cargo) => ipcRenderer.invoke('create-data', name, dataInicio, cargo)
});

