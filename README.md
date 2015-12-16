
## Installation	

	npm install bamzc [-g]

## Explain
	
	查找指定目录下得所有使用commonJS规范编写的js文件(*/rjs/*.js || */*_rjs.js)
	
	进行browserify编译(支持短命名方式引用模块)，并同步文件修改(删除文件、增加文件、修改文件)

	在*/bamzc/执行:npm test，*/bamzc/js/文件内查看编译后的代码
	
	按照./test/bamzcfile.js建立同名文件，全局执行bamzc命令
	
	进行对js、css、sass和image文件的压缩处理

## Options

	* `inputPath` -- 需要进行编译的文件夹名称
	* `output.banner` -- 输出文件banner ==> <%time%>:更新时间
	* `output.dest` -- 输出文件的路径
	* `output.type` -- 输出方式
		
		`normal`: 单独文件输出  `deep`: 包含路径输出
		
	* `output.compress` -- boolean 是否压缩
	* `watch` -- 是否同步更新，`interval`为轮询时常

## Example
	
	方法调用：
~~~ javascript
	
	//调用方法 from: ./test/test.js
    var bamzc = require('bamzc'); 
    var config = {
        //需要编译的文件夹
		inputPath: './test/src',
		js: {
			output: {
				//输出banner
				banner: '/*build at <%time%>*/\n',
				//输出文件路径
				dest: './js',
				//输出方式: normal、deep
				type: 'normal',
				//是否压缩
				compress: true
			}
		},
		rjs: {
			output: {
				//输出banner
				banner: '/*build at <%time%>*/\n',
				//输出文件路径
				dest: './js',
				//输出方式: normal、deep
				type: 'normal',
				//是否压缩
				compress: true
			}
		},
		css: {
			output: {
				//输出banner
				banner: '/*build at <%time%>*/\n',
				//输出文件路径
				dest: './css',
				//输出方式: normal、deep
				type: 'normal',
				//是否压缩
				compress: true
			}
		},
		image: {
        	output: {
            	//输出文件路径
            	dest: './i'
        	},
        	patterns: ['.png', '.jpg', '.gif']
    	},
		//css:false,
		watch: {
			//watch轮询的时常，默认值1200
			interval: 800
		}
    };
    bamzc(config);
    
~~~

	业务代码：
~~~ javascript
	
	//引用模块 from: ./test/src/rjs/test.js
    //node模块的引用
    var PATH = require('path');
    //工程文件的引用
    var t2 = require('./t2');

    console.log(PATH);
    t2();
	
~~~

## License

	(The MIT License) Copyright (c) 2014 - 2015 bamzc
	