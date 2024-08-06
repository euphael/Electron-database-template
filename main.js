const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const { selectFuncionarios, selectFuncionariosByCargo, createData, updateData, deleteData, selectCargos, createHorasPositivas, createHorasNegativas } = require('./src/database/database');

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

ipcMain.handle('select-funcionarios-by-cargo', async (event, cargo) => {
  try {
    const func = await selectFuncionariosByCargo(cargo);
    return func;
  } catch (err) {
    console.error('Erro ao buscar dados por cargo:', err.message);
    throw err;
  }
});

ipcMain.handle('select-cargos', async (event, args) => {
  try {
    const cargos = await selectCargos();
    return cargos
  } catch (err) {
    console.error('Erro ao buscar cargos: ', err.message);
    throw err;
  }
})

ipcMain.handle('create-data', async (event, name, dataInicio, horasPositivas, horasNegativas, cargo) => {
  try {
    const result = await createData(name, dataInicio, horasPositivas, horasNegativas, cargo);
    return result;
  } catch (err) {
    console.error('Erro ao criar dados', err.message);
    throw err;
  }
});

ipcMain.handle('update-data', async (event, id, name, dataInicio, horasPositivas, horasNegativas, cargo) => {
  try {
    const result = await updateData(id, name, dataInicio, horasPositivas, horasNegativas, cargo);
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
});

ipcMain.handle('create-horas-positivas', async (event, id, horas) => {
  try {
    const result = await createHorasPositivas(id, horas);
    return result;
  } catch (err) {
    console.error('Erro ao criar horas positivas:', err.message);
    throw err;
  }
});

ipcMain.handle('create-horas-negativas', async (event, id, horas) => {
  try {
    const result = await createHorasNegativas(id, horas);
    return result;
  } catch (err) {
    console.error('Erro ao criar horas negativas:', err.message);
    throw err;
  }
});