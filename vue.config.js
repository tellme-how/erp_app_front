const path = require('path');
const resolve = filename => path.resolve(__dirname, filename);

module.exports = {
    lintOnSave: false,
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: process.env.VUE_APP_TITLE,
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('src', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('directives', resolve('src/directives'))
            .set('helpers', resolve('src/helpers'))
            .set('views', resolve('src/views'));
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: '@import "assets/styles/index.scss";'
            }
        }
    },
    devServer: {
        port: 9010,
        open: true,
        proxy: {
            '/api': {
                // target: 'http://192.168.21.199:6767', //API服务器的地址
                // target: 'http://192.168.21.205:6767',
                //target: 'http://192.168.21.78:6767',
                //target:'http://localhost:6767',
                //服务器
				target: 'http://192.168.85.87:7767',
				//戚俊然
				//				target: 'http://10.128.32.221:6767',
				//王琦
				//				target: 'http://10.128.32.231:6767',
				//刘勇健
				//				 target:'http://10.128.32.235:6767',
                // target:'http://192.168.21.78:5050',
                ws: true, //代理websockets
                changeOrigin: true, // 虚拟的站点需要更管origin
                pathRewrite: { //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/api': ''
                }
            },
            //'/Lapi': {
                //target:'http://192.168.85.96:6112',//API服务器的地址
                //ws: true, //代理websockets
                //changeOrigin: true, // 虚拟的站点需要更管origin
                //pathRewrite: { //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    //'^/Lapi': ''
                //}
            //}
        },
        hotOnly: false,
        https: false,

    }
};
