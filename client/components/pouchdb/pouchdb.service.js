// service factory (Database) for pouchdb
// Notification is a Angular.js service providing simple notifications using Bootstrap 3 styles with css transitions for animationshttps://github.com/alexcrack/angular-ui-notification
// http://plnkr.co/edit/h08qQF2qlVE3arERpdfi?p=preview
'use strict';

angular.module('meancouchApp')
    
    .factory('Database', function ($q, Notification) {
        var _db;
        var _localDB;
        var _databaseName;

        var Database = function (databaseName) {
            _databaseName = databaseName;
            // setup remote db (couchdb)
            _db = new PouchDB('http://127.0.0.1:5984/test', {skipSetup: true});
            // https://github.com/nolanlawson/pouchdb-authentication
            PouchDB.plugin('pouchdb-authentication');
            // get local db name from controller
            /* _localDB = new PouchDB(_databaseName);
            
            _db.sync(_localDB, {
              live: true,
              retry: true
            }).on('change', function (change) {
              // yo, something changed!
              console.log('yo, something changed')
            }).on('paused', function (info) {
              // replication was paused, usually because of a lost connection
              console.log('connection lost')
            }).on('active', function (info) {
              // replication was resumed
              console.log('connection resumed')
            }).on('error', function (err) {
              // totally unhandled error (shouldn't happen)
              console.log('error, this shouldn`t happen')
            }).on('denied', function (info) {
              // a document failed to replicate, e.g. due to permissions
              console.log('a document failed to replicate, e.g. due to permissions')
            }).on('complete', function (info) {
              // handle complete
              console.log('complete')
            }); */
        };

        Database.prototype.all = function (options) {
            /* options to be set in controller */
            /* options = {
                include_docs: true,
                attachments: true
               }; */

            return $q.when(_db.allDocs(options))
                .then(function (response) {
                // Remove all design documents
                    for (var i = response.rows.length - 1; i >= 0; i--) {
                       if (response.rows[i].id.indexOf('_design') >= 0) {
                          delete response.rows.splice(i, 1);
                       }
                    }
                // convert response to ...?
                    var converted;
                    converted = response.rows.map(function (element) {
                        return element.doc;
                    });
                    return converted;
            });
        };

        Database.prototype.create = function (record) { console.log(record)
            return $q.when(_db.put(record)) // _db.post(record)
                .then(function (response) {
                // handle success
                    return Notification.success('successful created on ' + response.id);
                })
                .catch(function (error) {console.log(error.reason)
                // handle error
                    if (error) {
                        if (error.name === 'conflict') {
                        // There is a conflict. Nothing was created.
                            return Notification.error(error.reason + ' Nothing was created.');
                        } else if (error.name === 'forbidden') {
                          // You dont have permissions. Nothing was created.
                            return Notification.error(error.reason + ' Nothing was created.');
                        } else {
                          // HTTP error, cosmic rays, etc.
                            return Notification.error('Something went wrong. Thats all we know.');
                        }
                    }
                });
        };

        Database.prototype.signup = function (user) {
            return $q.when(_db.signup(user.name, user.password))
                .then(function (response) {
                // handle response from db
                    return Notification(response.ok);
                })
                .catch(function (error) {
                // handle error
                    if (error) {
                        if (error.name === 'conflict') {
                        // "batman" already exists, choose another username
                            return Notification.error('username already exists, choose another');
                        } else if (error.name === 'forbidden') {
                          // invalid username
                            return Notification.error('invalid username');
                        } else {
                          // HTTP error, cosmic rays, etc.
                            return Notification.error('something went totaly wrong. reload the page.');
                        }
                    }
                });
        };

        Database.prototype.signin = function (user) {
            return $q.when(_db.login(user.name, user.password))
                .then(function (response) {
                // handle response from db
                    Notification.success(response.name + ' successful signed in');
                    return response.name;
                })
                .catch(function (error) {
                // handle error
                    if (error) {
                        if (error.name === 'unauthorized') {
                        // name or password incorrect
                            Notification.error('name or password incorrect');
                            return false;
                        } else {
                          // HTTP error, cosmic rays, a meteor, etc.
                            Notification.error('something went wrong.');
                            return false;
                        }
                    }
                });
        };

        Database.prototype.logout = function (user) {
            return $q.when(_db.logout())
                .then(function (response) {
                // handle response from db
                    Notification.success('successful logged out');
                    return response;
                })
                .catch(function (error) {
                // handle error
                    if (error) {
                        // network error
                        Notification.error('network error');
                        return false;
                    }
                });
        };
// TODO - this function has a problem
        Database.prototype.isAuthenticated = function () {
            return $q.when(_db.getSession())
                .then(function (response) {
                // handle response from db
                    if (!response.userCtx.name) {
                    // nobody is logged in
                        Notification.info('nobody is logged in');
                        return false;
                    } else {
                    // response.userCtx.name is the current user
                        Notification.warning(response.userCtx.name + ' is the current user');
                        return response.userCtx.name;
                    }
                })
                .catch(function (error) {
                // handle error
                    if (error) {
                    // network error
                        return Notification.error('network error');
                    }
                });
        };

        Database.prototype.remove = function (record) {
            return $q.when(_db.remove(record));
        };

        return Database;
    });