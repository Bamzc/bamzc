'use strict'
var path = require("path");
var trace = require('../lib/trace');
exports.header = function () {
    trace.log('\nBamzc: The JavaScript Task Runner (v' + require('../package.json').version + ')')
}
exports.usage = function(){
	trace.header('Usage')
	trace.log(' bamzc [options] [task [task ...]]');
}
exports.options = function(){
	trace.header('Options');
	trace.log('      --help,h   Display this help text');
	trace.log('   --version,v   Print the bamzc version.');
}
exports.tasks = function(){
	trace.header('Available tasks');
	trace.log('	    uglify Minify files with uglifyJS *');
	trace.log('	browserify Require js *');
	trace.log('	    cssmin Minify css *');
	trace.log('	  imagemin Minify PNG,JPEG and GIF images *');
	trace.log('	     watch run predefined tasks whenever watched files change');
	trace.log('	      sass Compile Sass to CSS *');
}
exports.content = function(){
	exports.header();
	exports.usage();
	exports.options();
	exports.tasks()
}