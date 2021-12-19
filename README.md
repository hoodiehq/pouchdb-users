# pouchdb-users

> PouchDB plugin to simulate CouchDB’s \_users database behavior.

This forked version allows _users behavior to be added to any db while still retaining the ability to add other doc types as well.  Only 'user' doc types are validated for _user db behavior.

[![Build Status](https://travis-ci.org/hoodiehq/pouchdb-users.svg?branch=master)](https://travis-ci.org/hoodiehq/pouchdb-users)
[![Coverage Status](https://coveralls.io/repos/hoodiehq/pouchdb-users/badge.svg?branch=master)](https://coveralls.io/r/hoodiehq/pouchdb-users?branch=master)
[![Dependency Status](https://david-dm.org/hoodiehq/pouchdb-users.svg)](https://david-dm.org/hoodiehq/pouchdb-users)
[![devDependency Status](https://david-dm.org/hoodiehq/pouchdb-users/dev-status.svg)](https://david-dm.org/hoodiehq/pouchdb-users#info=devDependencies)

`pouchdb-users` hashes passwords and ensures doc formats as CouchDB does it with
its `_users` database, so that any database and leveldown adapter can be used
besides CouchDB for persisting user accounts.

## Example

```js
var PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-users'))

var db = new PouchDB('my-users', { db: require('memdown') })

db.installUsersBehavior()
  .then(function () {
    return db.put({
      _id: 'org.couchdb.user:test',
      type: 'user',
      name: 'test',
      password: 'secret'
    })
  })
  .then(function () {
    return db.get('org.couchdb.user:test')
  })
  .then(function (doc) {
    // doc looks like this:
    // {
    //    "_id": "org.couchdb.user:test",
    //    "_rev": "1-e7172e5a925427378af944674c1c95d0",
    //    "password_scheme": "pbkdf2",
    //    "iterations": 10,
    //    "type": "user",
    //    "name": "test",
    //    "roles": [],
    //    "derived_key": "a13593349e8838c2349a463e570be80a1064cc4a",
    //    "salt": "9c9e3161c6b71455af35e80eb1152db0"
    // }
  })
```

The above example works the same against a couchdb

```js
var db = new PouchDB('http://localhost:5984/_users', {
  auth: {
    username: 'admin',
    password: 'secret'
  }
})

db.installUsersBehavior()
  .then(function () {
    return db.put({
      _id: 'org.couchdb.user:test',
      type: 'user',
      name: 'test',
      password: 'secret'
    })
  })
```

## How it works

`pouchdb-users` does not add any additional methods to `db`, but hooks into
`db.put`, `db.post` and `db.bulkDocs` to modify the document before storing it
in the database.

Note that `pouchdb-users` does not implement any access restrictions, there
is no user context available in PouchDB.

## Testing

Local setup

```
git clone git@github.com:hoodiehq/pouchdb-users.git
cd pouchdb-users
npm install
```

Run all tests and code style checks

```
npm test
```

Run specific tests only

```
node tests/specs/debug.js # run .debug() unit tests
```

**PROTIP™:** pipe output through a [pretty reporter](https://www.npmjs.com/package/tape#pretty-reporters)

### License

[Apache-2.0](https://github.com/hoodiehq/hoodie/blob/master/LICENSE)
