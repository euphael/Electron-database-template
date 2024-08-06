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
    db.run("CREATE TABLE IF NOT EXISTS cargos (id INTEGER PRIMARY KEY, name TEXT)");
    db.run(`CREATE TABLE IF NOT EXISTS funcionarios (
      id INTEGER PRIMARY KEY, 
      name TEXT, 
      dataInicio DATE, 
      horasPositivas TIME, 
      horasNegativas TIME, 
      cargo_id INTEGER, 
      FOREIGN KEY(cargo_id) REFERENCES cargos(id)
    )`);
  });
});

const querySelectAll = `
  SELECT f.id, f.name, f.dataInicio, f.horasPositivas, f.horasNegativas, c.name as cargo 
  FROM funcionarios f 
  JOIN cargos c ON f.cargo_id = c.id
`;

const querySelectCargos = `
  SELECT *
  FROM cargos
`;

function selectFuncionarios() {
  return new Promise((resolve, reject) => {
    db.all(querySelectAll, (err, rows) => {
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

function selectFuncionariosByCargo(cargoName) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT f.id, f.name, f.dataInicio, f.horasPositivas, f.horasNegativas, c.name as cargo 
      FROM funcionarios f 
      JOIN cargos c ON f.cargo_id = c.id
      WHERE c.name = ?
    `;
    db.all(query, [cargoName], (err, rows) => {
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

function selectCargos() {
  return new Promise((resolve, reject) => {
    db.all(querySelectCargos, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

function createData(name, dataInicio, horasPositivas, horasNegativas, cargoName) {
  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM cargos WHERE name = ?", [cargoName], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (row) {
          const cargoId = row.id;
          const stmt = db.prepare("INSERT INTO funcionarios (name, dataInicio, horasPositivas, horasNegativas, cargo_id) VALUES (?, ?, ?, ?, ?)");
          stmt.run(name, dataInicio, horasPositivas, horasNegativas, cargoId, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.lastID });
            }
          });
          stmt.finalize();
        } else {
          reject(new Error(`Cargo not found: ${cargoName}`));
        }
      }
    });
  });
}

// function createCargo(name) {
//   return new Promise((resolve, reject) => {
//     const stmt = db.prepare("INSERT INTO cargos (name) VALUES (?)");
//     stmt.run(name, function (err) {
//       if (err) {
//         reject(err);
//       } else {
//         resolve({ id: this.lastID });
//       }
//     });
//     stmt.finalize();
//   });
// }

// createData('Funcionário 1', '2023-10-01', '08:00', '00:00', 'teste1')
//   .catch(err => {
//     console.error('Erro ao inserir Funcionário 1:', err.message);
//   });

// createData('Funcionário 2', '2023-10-02', '09:00', '00:30', 'teste2')
//   .catch(err => {
//     console.error('Erro ao inserir Funcionário 2:', err.message);
//   });

// createData('Funcionário 3', '2023-10-03', '07:30', '00:15', 'teste3')
//   .catch(err => {
//     console.error('Erro ao inserir Funcionário 3:', err.message);
//   });

function updateData(id, name, dataInicio, horasPositivas, horasNegativas, cargoName) {
  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM cargos WHERE name = ?", [cargoName], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (row) {
          const cargoId = row.id;
          const stmt = db.prepare("UPDATE funcionarios SET name = ?, dataInicio = ?, horasPositivas = ?, horasNegativas = ?, cargo_id = ? WHERE id = ?");
          stmt.run(name, dataInicio, horasPositivas, horasNegativas, cargoId, id, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ changes: this.changes });
            }
          });
          stmt.finalize();
        } else {
          reject(new Error(`Cargo not found: ${cargoName}`));
        }
      }
    });
  });
}

function deleteData(id) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("DELETE FROM funcionarios WHERE id = ?;");
    stmt.run(id, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    })
    stmt.finalize();
  })
}

module.exports = { db, selectFuncionarios, selectFuncionariosByCargo, selectCargos, updateData, createData, deleteData };