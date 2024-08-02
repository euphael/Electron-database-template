const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const { fetchData, updateData } = require('./src/database/database');

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

ipcMain.handle('fetch-data', async (event, args) => {
  try {
    const data = await fetchData();
    return data;
  } catch (err) {
    console.error('Erro ao buscar dados:', err.message);
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