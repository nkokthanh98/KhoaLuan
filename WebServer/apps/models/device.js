const q = require("q");
const db = require("../common/database");
var conn = db.getConnection();

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
        let sql = `SELECT avg(datavalue)  as result FROM sensordata WHERE did = ${did} and date(time) = date(current_timestamp) and month(time) = month(current_timestamp) and year(time) = year(current_timestamp)`
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
    addData: addData,
    getDataByDID: getDataByDID,
    getAvgByDID: getAvgByDID
}
