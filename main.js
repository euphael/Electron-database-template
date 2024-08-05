const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const { selectFuncionarios, createData, updateData, deleteData, selectCargos } = require('./src/database/database');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preloader.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    },
  });
  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  createWindow();

  app.on("active", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle('select-funcionarios', async (event, args) => {
  try {
    const func = await selectFuncionarios();
    return func;
  } catch (err) {
    console.error('Erro ao buscar dados:', err.message);
    throw err;
  }
});

ipcMain.handle('select-cargos', async (event, args) => {
  try{
    const cargos = await selectCargos();
    return cargos
  } catch (err) {
    console.error('Erro ao buscar cargos: ', err.message);
    throw err;
  }
})

ipcMain.handle('create-data', async (event, name, dataInicio, cargo) => {
  try {
    const result = await createData(name, dataInicio, cargo);
    return result;
  } catch (err) {
    console.error('Erro ao criar dados', err.message);
    throw err;
  }
});

ipcMain.handle('update-data', async (event, id, name, dataInicio, cargo) => {
  try {
    const result = await updateData(id, name, dataInicio, cargo);
    return result;
  } catch (err) {
    console.error('Erro ao atualizar dados:', err.message);
    throw err;
  }
});

ipcMain.handle('delete-data', async (event, id) => {
  try {
    const result = await deleteData(id);
    return result
  } catch (err) {
    console.error('Error ao deletar dados: ', err.message);
    throw err;
  }
})