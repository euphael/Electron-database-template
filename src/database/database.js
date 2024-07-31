const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { formatarData } = require('../utils/dateUtils');

const db = new sqlite3.Database(path.join(__dirname, 'funcionarios.db'), (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('Conectado ao banco de dados SQLite.');

  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS funcionarios (id INTEGER PRIMARY KEY, name TEXT, dataInicio DATE, dataFim DATE, cargo TEXT)");

    // const stmt = db.prepare("INSERT INTO funcionarios (name, dataInicio, dataFim, cargo) VALUES (?, ?, ?, ?)");
    // stmt.run("NTESTE", "2023-01-01", "2023-12-31", "Desenvolvedor");
    // stmt.run("NTESTE2", "2023-02-01", "2023-11-30", "Designer");
    // stmt.run("TEADEA", "2023-03-01", "2023-10-31", "Gerente");
    // stmt.finalize();
    
  });
});

function fetchData() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM funcionarios', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach(row => {
          row.dataInicio = formatarData(row.dataInicio);
          row.dataFim = formatarData(row.dataFim);
        });
        resolve(rows);
      }
    });
  });
}

module.exports = { db, fetchData };