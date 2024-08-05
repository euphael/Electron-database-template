const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { formatarData } = require('../utils/dateUtils');
const { create } = require('domain');

const db = new sqlite3.Database(path.join(__dirname, 'funcionarios.db'), (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('Conectado ao banco de dados SQLite.');

  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS cargos (id INTEGER PRIMARY KEY, name TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS funcionarios (id INTEGER PRIMARY KEY, name TEXT, dataInicio DATE, cargo_id INTEGER, FOREIGN KEY(cargo_id) REFERENCES cargos(id))");

  });
});

const querySelectAll = `
  SELECT f.id, f.name, f.dataInicio, c.name as cargo 
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

function createData(name, dataInicio, cargoName) {
  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM cargos WHERE name = ?", [cargoName], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (row) {
          const cargoId = row.id;
          const stmt = db.prepare("INSERT INTO funcionarios (name, dataInicio, cargo_id) VALUES (?, ?, ?)");
          stmt.run(name, dataInicio, cargoId, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.lastID });
            }
          });
          stmt.finalize();
        } else {
          reject(new Error("Cargo not found"));
        }
      }
    });
  });
}

// function insertCargo(name) {
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

// async function insertSampleCargo() {
//   try {
//     const result = await insertCargo('teste1');
//     console.log('Cargo inserted successfully:', result);
//   } catch (error) {
//     console.error('Error inserting cargo:', error.message);
//   }
// }

// insertSampleCargo();

function updateData(id, name, dataInicio, cargoName) {
  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM cargos WHERE name = ?", [cargoName], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (row) {
          const cargoId = row.id;
          const stmt = db.prepare("UPDATE funcionarios SET name = ?, dataInicio = ?, cargo_id = ? WHERE id = ?");
          stmt.run(name, dataInicio, cargoId, id, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ changes: this.changes });
            }
          });
          stmt.finalize();
        } else {
          reject(new Error("Cargo not found"));
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

module.exports = { db, selectFuncionarios, selectCargos, updateData, createData, deleteData };