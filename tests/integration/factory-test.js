var PouchDB = require('pouchdb').defaults({
  db: require('memdown')
})
var test = require('tape')

var plugin = require('../../index')

test('db.installUsersBehavior()', function (t) {
  t.plan(13)

  PouchDB.plugin(plugin)
  var db = new PouchDB('foo')
  t.is(typeof db.installUsersBehavior, 'function', 'db.installUsersBehavior is a function')

  db.installUsersBehavior()

  .then(function (response) {
    t.is(response, undefined, 'resolves without argument')

    return db.put({
      _id: 'org.couchdb.user:test',
      type: 'user',
      name: 'test',
      password: 'secret',
      roles: []
    })
  })

  .then(function () {
    return db.get('org.couchdb.user:test')
  })

  .then(function (doc) {
    t.is(doc.password, undefined, 'password gets removed from doc on .put')

    t.is(doc.iterations, 10, 'sets iterations to 10 on .put')
    t.is(doc.password_scheme, 'pbkdf2', 'sets password_scheme to pbkdf2 on .put')
    t.ok(/[0-9a-f]{48}/.test(doc.salt), 'sets salt on .put')
    t.ok(/[0-9a-f]{40}/.test(doc.derived_key), 'sets derived_key on .put')

    // invalid doc
    return db.put({
      _id: 'foo:test'
    })
  })

  .catch(function (error) {
    t.is(error.name, 'forbidden', 'does not allow to create invalid user doc')

    return db.bulkDocs([{
      _id: 'org.couchdb.user:bulktest',
      type: 'user',
      name: 'bulktest',
      password: 'secret',
      roles: []
    }])
  })

  .then(function () {
    return db.get('org.couchdb.user:bulktest')
  })

  .then(function (doc) {
    t.is(doc.password, undefined, 'password gets removed from doc on .bulkDocs')

    t.is(doc.iterations, 10, 'sets iterations to 10 on .bulkDocs')
    t.is(doc.password_scheme, 'pbkdf2', 'sets password_scheme to pbkdf2 on .bulkDocs')
    t.ok(/[0-9a-f]{48}/.test(doc.salt), 'sets salt on .bulkDocs')
    t.ok(/[0-9a-f]{40}/.test(doc.derived_key), 'sets derived_key on .bulkDocs')
  })

  .then(function () {
    // calling isntall on existing db has no effect
    return db.installUsersBehavior()
  })

  .catch(t.error)
})
