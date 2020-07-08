const db = require("../common/database");
var con = db.getConnection();

async function calculateAverage(did, time) {
  const sql = `SELECT AVG(datavalue) AS average FROM sensordata WHERE did = ${did} AND time LIKE '${time}%'`;

  return new Promise((res, rej) => {
    con.query(sql, (err, row) => {
      if (err) return rej(err);
      res(row);
    });
  });
}

async function saveAverage(did, average, time) {
  const sql = `INSERT INTO averages (did, average, time) VALUES ('${did}', '${average}', '${time}')`;
  
  return new Promise((res, rej) => {
    con.query(sql, (err, row) => {
      if (err) return rej(err);
    });
  });
}

module.exports = {
  calculateAverage,
  saveAverage
}
