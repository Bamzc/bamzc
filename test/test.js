/**
 * Created by bamzc on 2015/10/26.
 * 测试文件，终端：npm test
 */

'use strict';
var bamzc = require('../index.js');
var config = {
    //需要编译的文件夹
    inputPath: './test/src',
    js: {
        options: {
            //输出banner
            banner: '/*build at <%time%>*/\n',
            //输出文件路径
            dest : 'js/',
            //输出方式: normal、deep
            type: 'normal',
            //是否压缩
            compress: false
        }
    },
    rjs: {
        options: {
            //输出banner
            banner: '/*build at <%time%>*/\n',
            //输出文件路径
            dest : 'js/',
            //输出方式: normal、deep
            type: 'normal',
            //是否压缩
            compress: false
        },
        //引用的库文件路径
        libraryPath: './src/core'
    },
    css: {
        options: {
            //输出banner
            banner: '/*build at <%time%>*/\n',
            //输出文件路径
            dest: 'css/',
            type: 'normal',
            //是否压缩
            compress: false
        }
    },
    image: {
        options: {
            //输出文件路径
            dest: 'i/'
        },
        patterns: ['.png', '.jpg', '.gif']
    },
    sass: {
        options:{
            dest : 'css/',
            type : 'normal',
            compress: true
        }
    },
    watch: {
        //watch轮询的时常，默认值1200
        interval: 800
    }
    //watch:false
};
bamzc(config)