/**
 * Created by wangxin on 15/10/3.
 */
'use strict';

var fs = require('fs');
var PATH = require('path');
var iconv = require('iconv-lite');
var watch = require('watch');
var sass = require("node-sass");
var browserify = require('browserify');
var browserifyPlus = require('../index');
var spawn = require('cross-spawn');
var distrbute = require('./distrbute.js');
var distrbuteScss = require('./distrbuteScss.js');
var trace = require('./trace.js');
var outputHandle = require('./output.js');
var outputHandleScss = require('./outputScss.js');

function getLength() {
    var i = 0, o = arguments[0];
    for (var j in o) (o.hasOwnProperty(j) && o[j]) && i++;
    return i;
}

/*
 * @author wangxin
 * 获取一个文件下所有文件路径
 * return object:
 * {
 *   fileName:filePath
 * }
 */
function getLibraryMap(fileDir, that) {
    var files = fs.readdirSync(fileDir);
    files.forEach(function (fileName) {
        var baseDir = fileDir + fileName, lstat = fs.lstatSync(baseDir);
        if (lstat.isDirectory()) {
            getLibraryMap(baseDir + PATH.sep, that);
        } else {
            if (/^.+\.js$/.test(fileName)) {
                var key = PATH.basename(fileName, '.js');
                if (!that[key]) {
                    //处理windows下路径(E:\a\b\c.js --> E:/a/b/c.js)
                    that[key] = baseDir.replace(/\\/gi, '/');
                } else {
                    trace.error('some file in library : \n' + baseDir + '\n' + that[key]);
                }
            }
        }
    });
    return that;
}

/*
 * @author wangxin
 * 进行browserify编译
 * content: 文件内容，string;
 * outputPath: 输出文件路径
 * return false;
 */
function doBrowserify(basePath, charset, config) {
    var b = new browserify();
    b.add(basePath);
    b.bundle(function (err, code) {
        if (err) {
            trace.error(err);
            fs.unlinkSync(basePath);
        } else {
            //browserify编译完成，开始输出
            outputHandle(code, basePath, charset, config, PATH.sep);
        }
    });
}
/*
 * @author baizhaoce
 * 进行scss编译
 * content: 文件内容，string;
 * outputPath: 输出文件路径
 * return false;
 * node-sass虽然强大但是需要装的工具太多
 * 因此使用cross-spawn直接调用sass编译
 *
 */
function doScss(text,basePath, charset, config) {
    /************node-sass*************/
    // sass.render({
    //     file: basePath,
    //     data: text,
    //     importer: function(url, prev, done) {
    //         // url is the path in import as is, which libsass encountered. 
    //         // prev is the previously resolved path. 
    //         // done is an optional callback, either consume it or return value synchronously. 
    //         // this.options contains this options hash, this.callback contains the node-style callback 
    //         someAsyncFunction(url, prev, function(result){
    //             done({
    //                 file: result.path, // only one of them is required, see section Special Behaviours. 
    //                 contents: result.data
    //             });
    //         });
    //     },
    //     // includePaths: [ 'lib/', 'mod/' ],
    //     outputStyle: config.outputScss.compress && 'compressed'
    // }, function(error, result) { // node-style callback from v3.0.0 onwards 
    //     if (error) {
    //         console.log(error.status); // used to be "code" in v2x and below 
    //         console.log(error.column);
    //         console.log(error.message);
    //         console.log(error.line);
    //     }else {
    //         outputHandleScss(result.css.toString(), basePath, charset, config, PATH.sep);
    //     }
    // });
    /****************spawn*****************/
    //处理path路径的操作系统兼容性
    var path = PATH.normalize((config.outputScss && config.outputScss.path) || './scss/');
    var outputPath = /^.+[\/\\]$/.test(path) ? path : path + PATH.sep;

    var fileName = PATH.basename(basePath, '.bsp.scss') + '.css';
    var p = basePath.replace(/\\/gi, '/');
    var compressed = (config.outputScss.compress && 'compressed') || "";
    //开始文件输出生成css
    spawn("sass", ["--style",""+compressed+"","--sourcemap=none",p,outputPath + fileName], {stdio: 'inherit'})
        .on('error', function(){
            trace.error("please install sass!")
        })
        .on('close', function (code) {
            //获取到文件内容后就删除过度文件
            fs.unlinkSync(basePath);
        });
}

/*
 * @author wangxin
 * 处理加载模块文件内容为路径名
 * rjsMap: rjs文件map对象
 * libraryMap: 库文件map对象
 * return false;
 */
function doReplace(rjsMap, libraryMap, opt) {
    for (var i in rjsMap) {

        if (!i) {
            trace.error('file error');
        }

        if (rjsMap.hasOwnProperty(i)) {
            var rjsPath = PATH.resolve(rjsMap[i]);

            var con = fs.readFileSync(rjsMap[i]);
            //这里不建议用gbk编码格式
            if (iconv.decode(con, 'gbk').indexOf('�') != -1) {
                var charset = 'utf8';
            } else {
                var charset = 'gbk';
            }

            var content = iconv.decode(con, charset);
            var text = content.replace(/<%bsp:(.+)%>/gi, function () {
                var key = RegExp.$1, libraryFilePath = libraryMap[key];
                if (!libraryFilePath) {
                    //<%bsp:moduleName%>通过文件名，加载某一模块
                    //当没有找到对应的库文件时，给出模块加载错误的提示
                    trace.error('file : ' + rjsPath + '\nhas no module : ' + key);
                } else {
                    return libraryFilePath;
                }
            });
            //准备做browserify编译
            fs.writeFileSync(i, text);

            doBrowserify(i, charset, opt);
        }
    }
    return false;
}

/*
 * @author baizhaoce
 * 处理加载模块文件内容为路径名
 * scssMap: scss文件map对象
 * libraryMap: 库文件map对象
 * return false;
 */
function doReplaceScss(scssMap, libraryMap, opt) {
    for (var i in scssMap) {

        if (!i) {
            trace.error('file error');
        }

        if (scssMap.hasOwnProperty(i)) {
            var scssPath = PATH.resolve(scssMap[i]);

            var con = fs.readFileSync(scssMap[i]);
            //这里不建议用gbk编码格式
            if (iconv.decode(con, 'gbk').indexOf('�') != -1) {
                var charset = 'utf8';
            } else {
                var charset = 'gbk';
            }

            var content = iconv.decode(con, charset);
            var text = content.replace(/<%bsp:(.+)%>/gi, function () {
                var key = RegExp.$1, libraryFilePath = libraryMap[key];
                if (!libraryFilePath) {
                    //<%bsp:moduleName%>通过文件名，加载某一模块
                    //当没有找到对应的库文件时，给出模块加载错误的提示
                    trace.error('file : ' + scssPath + '\nhas no module : ' + key);
                } else {
                    return libraryFilePath;
                }
            });

            //准备做browserify编译
            fs.writeFileSync(i, text);
            doScss(text,i, charset, opt);
        }
    }
    return false;
}

/*
 * @author baizhaoce
 * 监听js，scss文件的变化
 * opts: config配置文件
 */
function watchFile(opts){
    var rjsMap = distrbute(opts);
    var scssMap = distrbuteScss(opts);
    if (getLength(rjsMap) === 0) {
        trace.warn('no rjs file , process end');
        return false;
    } else {
        if (opts.libraryPath) {
            //获取库文件的映射列表
            //object： fileName : filePath
            var libraryMap = getLibraryMap(PATH.resolve(opts.libraryPath) + PATH.sep, {});
        }
        doReplace(rjsMap, libraryMap || {}, opts);
    }
    if (getLength(scssMap) === 0) {
        trace.warn('no scss file , process end');
        return false;
    } else {
        if (opts.libraryPath) {
            //获取库文件的映射列表
            //object： fileName : filePath
            var libraryMap = getLibraryMap(PATH.resolve(opts.libraryPath) + PATH.sep, {});
        }
        doReplaceScss(scssMap, libraryMap || {}, opts)
    }
    watch.watchTree(opts.inputPath, {
        filter: function (file) {
            if (PATH.extname(file) === '.js') {
                var fileName = PATH.basename(file);
                //windows的路径格式按unix处理
                var f = file.replace(/\\/gi, '/');
                //忽略掉所用文件名为*.bsp.js的修改
                if (/.*\.bsp\.js/gi.test(fileName)) {
                    return false;
                } else if (/.+\/rjs\/.*\.js/gi.test(f) || /.+_rjs\.js/gi.test(fileName)) {
                    return true;
                } else {
                    return false;
                }
            } else if (PATH.extname(file) === '.scss') {
                var fileName = PATH.basename(file);
                //windows的路径格式按unix处理
                var f = file.replace(/\\/gi, '/');
                //忽略掉所用文件名为*.bsp.js的修改
                if (/.*\.bsp\.scss/gi.test(fileName)) {
                    return false;
                } else if (/.+\/scss\/.*\.scss/gi.test(f)) {
                    return true;
                } else {
                    return false;
                }
            } else if (PATH.extname(file) === '') {
                return true;
            } else {
                return false;
            }
        },
        interval: opts.watch.interval || 1200
    }, function (file, curr, pre) {

        //处理连续调用两次的情况
        // if (curr && curr.mtime) {
        //     console.log(file+"=========5"+curr)
        //     if (module.ct == new Date(curr.mtime).getTime()) return false;
        //     module.ct = new Date(curr.mtime).getTime();
        // }

        if (typeof file == "object" && pre === null && curr === null) {
            trace.ok('browserify-plus task has been started...\n');
            trace.ok('sass-plus task has been started...\n');
        } else if (pre === null) {
            if (!(fs.lstatSync(file).isDirectory())) {
                if (PATH.extname(file) === '.js'){
                    var o = {};
                    o[PATH.dirname(file) + PATH.sep + PATH.basename(file, '.js') + '.bsp.js'] = file;
                    console.log(o)
                    doReplace(o, libraryMap || {}, opts);
                }
                if(PATH.extname(file) === '.scss'){
                    var o = {};
                    o[PATH.dirname(file) + PATH.sep + PATH.basename(file, '.scss') + '.bsp.scss'] = file;
                    doReplaceScss(o, libraryMap || {}, opts);
                }
                trace.log(file + ' : has been built.\n');
            }
        } else if (curr.nlink === 0) {
            if (PATH.extname(file) === '') return false;
            //var p = PATH.resolve(opts.output.path) + PATH.sep + file;
            //normal模式下，同时将压缩文件删除
            //opts.output.type === 'normal' && fs.unlinkSync(p);
            trace.log(file + ' : has been removed.\n');
        } else {
            var o = {};
            if (PATH.extname(file) === '.js'){
                o[PATH.dirname(file) + PATH.sep + PATH.basename(file, '.js') + '.bsp.js'] = file;
                doReplace(o, libraryMap || {}, opts);
            }
            if(PATH.extname(file) === '.scss'){
                o[PATH.dirname(file) + PATH.sep + PATH.basename(file, '.scss') + '.bsp.scss'] = file;
                doReplaceScss(o, libraryMap || {}, opts);
            }
            trace.log(file + ' : has been changed at :' + new Date());
        }
    });
}
/*
 * @author wangxin
 * 初始化方法
 * opts: 配置参数
 * 详情参考 ../test/test.js ==> config
 */
module.exports = function (opts) {
    if (opts.watch) {
        watchFile(opts);
    }else{
        trace.ok('the task is being performed, please wait.');
    }
};
