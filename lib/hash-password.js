module.exports = hashPassword

var crypto = require('crypto')

function hashPassword (password, salt, iterations) {
  return new Promise(function (resolve, reject) {
    var cb = function (err, derivedKey) {
      if (err) {
        reject(err)
      } else {
        resolve(derivedKey.toString('hex'))
      }
    }
    if (process.version >= 6) {
      crypto.pbkdf2(password, salt, iterations, 20, 'sha1', cb);
    } else {
      crypto.pbkdf2(password, salt, iterations, 20, cb);
    }
  })
}
