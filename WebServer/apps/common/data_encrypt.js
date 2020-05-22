const bcrypt = require("bcrypt");
const config = require("config");

function hashPassword(password) {
    let saltRounds = config.get("salt");
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
}

function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    hashPassword: hashPassword,
    comparePassword: comparePassword
}