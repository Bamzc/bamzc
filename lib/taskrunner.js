/**
 * Created by bamzc on 2015/12/11.
 * runner任务
 */
 'use strict';
var browserify = require('browserify');
var iconv = require('iconv-lite');
var fs = require('fs');
var PATH = require('path');
var CleanCSS = require('clean-css');
var Imagemin = require('imagemin');
var UglifyJS = require('uglify-js');
var spawn = require('cross-spawn');
var printOut = require('./printout.js');
var trace = require('./trace.js');

function Runner(basePath,config){
    this.code = null;
    this.type = 'js';
    this.basePath = basePath;
    this.config = config;
}
Runner.prototype.cssmin = function(){
    var _self = this,
        basePath = _self.basePath,config = _self.config,
        type = 'css',minText,
        content = iconv.decode(fs.readFileSync(basePath),'gbk');
    var cssObj = new CleanCSS({
        relativeTo: PATH.dirname(basePath),
        report: 'min'
    }).minify(content);

    if (cssObj.errors && cssObj.errors.length) trace.warn('error: ' + cssObj.errors[0]);
    minText = cssObj.styles;
    printOut(basePath,config,minText,type);
}
Runner.prototype.jsmin = function(){
    var _self = this,
        basePath = _self.basePath,config = _self.config,
        content = _self.code,type = _self.type,
        output,minText;
    if (type === "js") {
        content = iconv.decode(fs.readFileSync(basePath),'utf8');
    };
 	if(config[type].options && config[type].options.compress){
        //js文件压缩的输出配置
        output = UglifyJS.OutputStream({
            ascii_only: true,
            max_line_len: null
        });
        //性能优化，替换之前的压缩方式
        UglifyJS.parse(content, {
            filename: basePath
        }).print(output);

        //获取文件内容
        minText = output.get();
    }else{
        minText = content;
    }
    printOut(basePath,config,minText,type);
}
Runner.prototype.rjsmin = function(){
    var _self = this,
        basePath = _self.basePath,
        config = _self.config;
    var b = new browserify({
        entries: basePath,
        debug: config.rjs.debug || false
    });
    b.bundle(function (err, code) {
        if (err) {
            trace.error(String(err));
        } else {
            //browserify编译完成，开始输出
            _self.code = iconv.decode(code,'utf8');
            _self.type = "rjs";
            _self.jsmin(basePath,config)
        }
    });
}
Runner.prototype.imagemin = function(){
    var _self = this,
        basePath = _self.basePath,config = _self.config;
 	~function () {
        new Imagemin().src(basePath).dest(PATH.normalize(config.image.options.dest)).run();
    }();
}
Runner.prototype.sassmin = function(){ 
    var _self = this,type = "sass",compressed = '',
        basePath = _self.basePath,config = _self.config;
    var path = PATH.normalize((config[type].options && config[type].path) || './css/');
    var fileName = PATH.basename(basePath, '.scss') + '.css';
    var p = basePath.replace(/\\/gi, '/');
    if(config[type].options.compress){
        compressed = 'compressed';
    }
    //开始文件输出生成css
    spawn("sass", ["--style",""+compressed+"","--sourcemap=none",p,path + fileName], {stdio: 'inherit'})
    .on('error', function(){
        trace.error("please install sass!")
    })
    .on('close', function (code) {
    });
}
module.exports = function(basePath,config){
    return new Runner(basePath,config);
};