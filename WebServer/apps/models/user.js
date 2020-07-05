const q = require("q");
const db = require("../common/database");
var conn = db.getConnection();

function addUser(user) {
    if(user){
        let defer = q.defer();
        let query = conn.query('INSERT INTO users SET ?', user, (err, result) => {
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function getUser(username) {
    if(username){
        let defer = q.defer();
        let query = conn.query('SELECT * FROM users WHERE ?', {username: username}, (err, result) => {
            if(err)
                defer.reject(err);
            else
                defer.resolve(result)
        });
        return defer.promise;
    }
    return false;
}

function addData(data) {
    if(data){
        let defer = q.defer();
        let sql = `INSERT into sensordata (did, datavalue, time) values (${data.did}, ${data.value}, CURRENT_TIMESTAMP)`
        let query = conn.query(sql, (err, result) => {
            if(err){
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function getDataByDID(did) {
    if(did){
        let defer = q.defer();
        let sql = `SELECT datavalue, time FROM sensordata WHERE did = ${did} and date(time) = date(current_timestamp) and month(time) = month(current_timestamp) and year(time) = year(current_timestamp) order by time asc`
        let query = conn.query(sql, (err, result) => {
            if(err)
                defer.reject(err);
            else
                defer.resolve(result)
        });
        return defer.promise;
    }
    return false;
}

function getAvgByDID(did) {
    if(did){
        let defer = q.defer();
        let sql = `SELECT avg(datavalue) FROM sensordata WHERE did = ${did} and date(time) = date(current_timestamp) and month(time) = month(current_timestamp) and year(time) = year(current_timestamp)`
        let query = conn.query(sql, (err, result) => {
            if(err)
                defer.reject(err);
            else
                defer.resolve(result)
        });
        return defer.promise;
    }
    return false;
}
module.exports = {
    addUser: addUser,
    getUser: getUser
}
