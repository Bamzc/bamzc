/*
 * 通用方法
 */
 'use strict';
var PATH = require("path")
module.exports = {
    /*
     * @author wangxin
     * 深度复制，按条件赋值
     * return object;
     */
    extendDeep: function (parent) {
        var i,
            toStr = Object.prototype.toString,
            astr = '[object Array]',
            child = arguments[1] || {},
            dirName = arguments[2] || null;
        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                if (typeof parent[i] === "object") {
                    child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                    this.extendDeep(parent[i], child[i], dirName);
                } else {
                    if (dirName) {
                        if (/path/gi.test(i)) parent[i] = this.relative(dirName, parent[i]);
                    } else {
                        if (/path/gi.test(i) && !/^.+\/$/.test(parent[i])) parent[i] += '/';
                    }
                    child[i] = parent[i];
                }
            }
        }
        return child;
    },
 	/*
 	 * 解析路径 -->> 绝对路径
     * @param obj -->> 需要解析的对象
     * @param cur -->> 当前路径
     * return object;
 	 */
    analyticPath: function (obj,cur) {
        var k,
            toStr = Object.prototype.toString;
        for (k in obj) {
            if(obj.hasOwnProperty(k)){
                if (toStr.call(obj[k]) === "[object Object]"){
                    this.analyticPath(obj[k],cur)
                }else{
                    if(/path/gi.test(k)){
                       obj[k] = this.relative(cur,obj[k]); 
                    } 
                }
            }
        }
        return obj;
    },
    forEach : function(handle){
        var arr = this, len = arr.length, i = 0;
        for (; i < len; i++){
            if(handle(arr[i], i) === false) return;
        }
    },
    /*
     * 获取文件路径方法
     * basePath是A文件绝对路径，outPath是B相对A的相对路径
     * return string: B的绝对路径
     */
    relative: function (basePath, outPath) {
        /**
         * 1.PATH.extname
         *  返回path路径文件扩展名，如果path以 ‘.' 为结尾，
         *  将返回 ‘.'，如果无扩展名 又 不以'.'结尾，将返回空值。
         * 2.PATH.join
         *  将多个参数组合成一个 path
         *  例如path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')
         *  return '/foo/bar/baz/asdf'
         */
        var symbol = PATH.sep, dirArr = outPath.replace(/(\\|\/)/g, symbol).split(symbol), $p;
        switch (dirArr[0]) {
            case '.':
                $p = (PATH.extname(basePath) !== '' ? PATH.join(PATH.dirname(basePath), outPath) : PATH.join(basePath, outPath));
                break;
            case '' :
                $p = outPath;
                break;
            case '..':
                var baseArr = basePath.split(symbol);
                this.forEach.call(dirArr, function (dir, i) {
                    if (dir === '..') {
                        baseArr.pop();
                    } else {
                        $p = PATH.join(baseArr.join(symbol), dirArr.slice(i).join(symbol));
                        return false;
                    }
                });
                break;
            default :
                $p = PATH.join(basePath, outPath);
        }
        return $p;
    },
     /*
     * @author wangxin
     * 校验文件是否是rjs文件
     * file: 文件路径
     * return boolean;
     */
    isRJS: function (file) {
        return /.+\/rjs\/.*\.js/gi.test(file.replace(/\\/gi, '/')) || /.+_rjs\.js/gi.test(PATH.basename(file));
    },
    extend : function() {
        var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            // Skip the boolean and the target
            target = arguments[ i ] || {};
            i++;
        }
        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && typeof target !=="function" ) {
            target = {};
        }
        if ( i === length ) {
            target = this;
            i--;
        }
        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];
                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }
                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( typeof copy =="object" || (copyIsArray = Array ==copy.constructor) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && Array == src.constructor ? src : [];
                        } else {
                            clone = src && typeof src == "object" ? src : {};
                        }
                        // Never move original objects, clone them
                        target[ name ] = this.extend( deep, clone, copy );
                        // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    }

}