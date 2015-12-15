module.exports = function (newDoc, oldDoc, userCtx, secObj) {
  var i

  function throwError (message) {
    var error = new Error(message)
    error.name = 'forbidden'
    throw error
  }

  if ((oldDoc && oldDoc.type !== 'user') || newDoc.type !== 'user') {
    throwError('doc.type must be user')
  } // we only allow user docs for now

  if (!newDoc.name) {
    throwError('doc.name is required')
  }

  if (!newDoc.roles) {
    throwError('doc.roles must exist')
  }

  if (!Array.isArray(newDoc.roles)) {
    throwError('doc.roles must be an array')
  }

  for (var idx = 0; idx < newDoc.roles.length; idx++) {
    if (typeof newDoc.roles[idx] !== 'string') {
      throwError('doc.roles can only contain strings')
    }
  }

  if (newDoc._id !== ('org.couchdb.user:' + newDoc.name)) {
    throwError('Doc ID must be of the form org.couchdb.user:name')
  }

  if (oldDoc) { // validate all updates
    if (oldDoc.name !== newDoc.name) {
      throwError('Usernames can not be changed.')
    }
  }

  if (newDoc.password_sha && !newDoc.salt) {
    throwError('Users with password_sha must have a salt. See /_utils/script/couch.js for example code.')
  }

  // no system roles in users db
  for (i = 0; i < newDoc.roles.length; i++) {
    if (newDoc.roles[i][0] === '_') {
      throwError('No system roles (starting with underscore) in users db.')
    }
  }

  // no system names as names
  if (newDoc.name[0] === '_') {
    throwError('Username may not start with underscore.')
  }

  var badUserNameChars = [':']

  for (i = 0; i < badUserNameChars.length; i++) {
    if (newDoc.name.indexOf(badUserNameChars[i]) >= 0) {
      throwError('Character `' + badUserNameChars[i] + '` is not allowed in usernames.')
    }
  }
}
