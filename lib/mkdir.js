/**
 * Created by bamzc on 15/10/6.
 */

'use strict';
var fs = require('fs');
var PATH = require('path');

var mkdir = function (dist, callback) {
    dist = PATH.resolve(dist);
    fs.exists(dist, function (exists) {
        if (!exists) {
            mkdir(PATH.dirname(dist), function () {
                fs.mkdir(dist, function (err) {
                    callback && callback(err);
                });
            });
        } else {
            callback && callback(null);
        }
    });
};

mkdir.sync = function (dist) {
    dist = PATH.resolve(dist);
    if (!fs.existsSync(dist)) {
        mkdir.sync(PATH.dirname(dist));
        fs.mkdirSync(dist);
    }
};

module.exports = mkdir;
