const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

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

const db = new sqlite3.Database('mydatabase.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('Conectado ao banco de dados SQLite.');

// Exemplo de criação de tabela
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS mytable (id INTEGER PRIMARY KEY, name TEXT)");
  const stmt = db.prepare("INSERT INTO mytable (name) VALUES (?)");
    stmt.run("NTESTE");
    stmt.run("NTESTE2");
    stmt.run("TEADEA");
    stmt.finalize();
  });
});

ipcMain.handle('fetch-data', async (event, args) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM mytable', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle('insert-data', async (event, name) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO mytable (name) VALUES (?)', [name], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});