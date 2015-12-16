/**
 * Created by bamzc on 15/10/26.
 */

'use strict';
var util = require("./lib/util");
var trace = require("./lib/trace");
var distrbute = require("./lib/distrbute");
var watchTask = require("./lib/taskwatch");
var runner = require("./lib/taskrunner");

module.exports = function (opts) {
	function walk(map,type){
		var arr = [];
	    for(var i in map){
	        if(!i){
	            trace.error('file is no exist');
	            return;
	        }
	        if(map.hasOwnProperty(i)){
	        	if(type == "rjs"){
	            	runner(map[i],opts).rjsmin();
	        	}else if(type == "js"){
	            	runner(map[i],opts).jsmin();
	        	}else if(type == "css"){
	            	runner(map[i],opts).cssmin();
	        	}else if(type == "sass"){
	        		runner(map[i],opts).sassmin();
	        	}
	        	arr.push(map[i]);
	        }
	    }
	    if(type == "image"){
	   		if (arr.length <=0) return;
	   		trace.load('image compressed, waiting...');
        	runner(arr,opts).imagemin();
	    };
	}
    var fileMap = distrbute(opts),
        rjsMap = fileMap.rjs,
        jsMap = fileMap.js,
        cssMap = fileMap.css,
        imageMap = fileMap.imageMap,
        sassMap = fileMap.sass;
        if(rjsMap){
        	walk(rjsMap,'rjs');
            trace.ok('rjs file processing tasks completed\n');
        }
        if(jsMap){
        	walk(jsMap,'js');
            trace.ok('js file processing tasks completed\n');
        }
        if(cssMap){
        	walk(cssMap,'css');
            trace.ok('CSS file processing tasks completed\n');
        }
        if(imageMap){
        	walk(imageMap,'image');
            trace.ok('image file processing tasks completed\n');
        }
        if(sassMap){
        	walk(sassMap,'sass')
            trace.ok('sass file processing tasks completed\n');
        }
        watchTask(opts);
};