module.exports = {
  installUsersBehavior: installUsersBehavior
}

var createBulkDocsWrapper = require('pouchdb-bulkdocs-wrapper')
var Promise = require('lie')
var wrappers = require('pouchdb-wrappers')

var modifyDoc = require('./lib/modify-doc')

function installUsersBehavior () {
  var db = this

  return new Promise(function (resolve) {
    var writeWrappers = {}

    writeWrappers.put = function (original, args) {
      return modifyDoc(args.doc).then(original)
    }
    writeWrappers.post = writeWrappers.put
    writeWrappers.bulkDocs = createBulkDocsWrapper(modifyDoc)

    wrappers.installWrapperMethods(db, writeWrappers)

    resolve()
  })
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(module.exports)
}
