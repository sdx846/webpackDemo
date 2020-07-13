const path=require('path');
//打包时自动生成html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//拷贝静态资源
const CopyWebpackPlugin = require('copy-webpack-plugin');
//打包结果每次都是最新的，自动清理dist目录
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
//自定义插件
const  RemoveCommentsPlugin = require('./remove-commonts-plugin');
module.exports={
    mode:'none',
    entry:'./src/main.js',//./src/css/a.css
    output:{
        filename:'bundle.js',
        path:path.join(__dirname,'dist')
    },
    module:{
        rules:[
         {
            test:/\.md$/,
            use:['html-loader','./markdown-loader'],//多个用数组，一个用字符串。
         },
        //  {
        //     test:/\.css$/,
        //     use:['style-loader','css-loader']
        //  }
        ]
    },
    plugins:[
        new CleanWebpackPlugin(),
        //用于生成index.html
        new HtmlWebpackPlugin({
            title:'webpack plugin sample',
            meta:{
                viewport:'width=device-width'
            },
            //template:'./src/index.html',//指定模板，没有会自动生成。
        }),
        //用于生成about.html
        new HtmlWebpackPlugin({
           filename:'about.html'
        }),
        // new CopyWebpackPlugin([
        //     'public',//需要拷贝的目录或者路径//这样配置报错了
        // ]),
        new CopyWebpackPlugin({
            patterns: [
                //下面这几种写法都可以，但是assets和public目录里不能为空，否则会报错。
                // { from: path.join(__dirname,'assets'),to: 'assets' }
                // { from: 'assets',to: 'assets' }
                // { from: 'public',to: 'public' }
                'public'
            ],
        }),
        new RemoveCommentsPlugin(),//自定义插件，删除bundle.js里每行代码前面的注释。
    ]
};