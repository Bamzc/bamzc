/**
 * Created by bamzc on 2015/12/11.
 * watch任务
 */
'use strict';
var PATH = require('path');

var watch = require('watch');

var trace = require('./trace.js');
var util = require('./util.js');
var runner = require('./taskrunner.js')

function watchTask (opts){
	function isInDirectory(file, opts){
		var dirPath = PATH.normalize(opts.rjs.libraryPath),
	        filePath = PATH.normalize(PATH.resolve(file)).split(PATH.sep),
	        is = true;
	        util.forEach.call(dirPath.split(PATH.sep), function (dir, i) {
	            if (dir != filePath[i]) {
	                is = false;
	                return false;
	            }
	        });
	        return is;
	}
	function rule(file){
		var extname = PATH.extname(file);
        if (opts.rjs && opts.rjs.libraryPath && isInDirectory(file, opts)) {
            return false;
        }
        if ((extname === '.js' && opts.js) || (util.isRJS(file) && opts.rjs) || extname === '' || (extname === '.css' && opts.css) || (extname === '.scss' && opts.css) || (opts.image && opts.image.patterns.indexOf(extname) !== -1)) {
            return true;
        }

        return false;
	}
    function judgment(file,extname){
        if (util.isRJS(file)) {
            runner(file,opts).rjsmin();
        }else if(extname === "js"){
            runner(file,opts).jsmin();
        }else if(extname === "css"){
            runner(file,opts).cssmin();
        }else if(extname === "scss"){
            runner(file,opts).sassmin();
        }else if (opts.image.patterns.indexOf('.' + extname) != -1) {
            var arr = [];
            arr[0] = file;
            runner(arr, opts).imagemin();
        };
    }
	function handle(file, curr, pre){
        var extname = PATH.extname(file).replace(/\./, '');
	    if (typeof file == "object" && pre === null && curr === null) {
            trace.ok('watch task has been started...\n');
            return false;
        }
        if (pre === null) {
            judgment(file,extname);
            trace.log(file + ' : has been built')
        } else if (curr.nlink === 0) {
            trace.log(file + ' : has been removed')
        } else {
			judgment(file,extname);
            trace.log(file + ' has been changed at ' + new Date());
        }
	}
	watch.watchTree(opts.inputPath, {
	    filter: rule,
	    interval: opts.watch.interval || 1200
	},handle);
}
module.exports = watchTask;

