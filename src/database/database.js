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
    db.run("CREATE TABLE IF NOT EXISTS funcionarios (id INTEGER PRIMARY KEY, name TEXT, dataInicio DATE, cargo TEXT)");

    // const stmt = db.prepare("INSERT INTO funcionarios (name, dataInicio, cargo) VALUES (?, ?, ?)");
    // stmt.run("NTESTE", "2023-01-01", "Desenvolvedor");
    // stmt.run("NTESTE2", "2023-02-01", "Designer");
    // stmt.run("TEADEA", "2023-03-01", "Gerente");
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
        });
        resolve(rows);
      }
    });
  });
}

function updateData(id, name, dataInicio, cargo) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("UPDATE funcionarios SET name = ?, dataInicio = ?, cargo = ? WHERE id = ?");
    stmt.run(name, dataInicio, cargo, id, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
    stmt.finalize();
  });
}

module.exports = { db, fetchData, updateData };