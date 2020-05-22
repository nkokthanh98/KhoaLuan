const config = require("config");
const mysql = require("mysql");

var connection = mysql.createConnection({
    host    : config.get("dbConfig.host"),
    port    : config.get("dbConfig.port"),
    user    : config.get("dbConfig.dbUser"),
    password: config.get("dbConfig.dbPassword"),
    database: config.get("dbConfig.dbName")
});

connection.connect();

function getConnection() {
    if(!connection)
        connection.connect();
    return connection;
}

module.exports = {
    getConnection: getConnection
}