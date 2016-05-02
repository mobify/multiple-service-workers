/**
 * Taken from https://github.com/jakearchibald/svgomg (and modified)
 * Under MIT licence
 */
'use strict';

var Idb = require('./indexeddouchbag');
var idbs = {};

var keyValName = 'keyval';

// avoid opening idb until first call
var getIdb = function(store) {
    if (!idbs[store]) {
        idbs[store] = new Idb(store, 1, function(db) {
            db.createObjectStore(keyValName);
        });
    }
    return idbs[store];
};

module.exports = {
    get: function(store, key) {
        return getIdb(store).get(keyValName, key);
    },
    set: function(store, key, val) {
        return getIdb(store).put(keyValName, key, val);
    },
    delete: function(store, key) {
        getIdb(store).delete(keyValName, key);
    }
};
