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
module.exports = {
    addUser: addUser,
    getUser: getUser
}