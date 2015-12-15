module.exports = modifyDoc

var generateSalt = require('./generate-salt')
var hashPassword = require('./hash-password')
var validateDocUpdate = require('./validate-doc-update')

function modifyDoc (doc) {
  try {
    validateDocUpdate(doc)
  } catch (error) {
    return Promise.reject(error)
  }

  if (typeof doc.password === 'undefined' || doc.password === null) {
    return Promise.resolve()
  }

  doc.iterations = 10
  doc.password_scheme = 'pbkdf2'

  return generateSalt().then(function (salt) {
    doc.salt = salt

    return hashPassword(doc.password, doc.salt, doc.iterations)
  }).then(function (hash) {
    delete doc.password
    doc.derived_key = hash
  })
}
