var path = require('path');
var webpack = require('webpack');
// var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin"); //css单独打包
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
// var APP_PATH = path.resolve(ROOT_PATH, 'app/js');
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
//Template的文件夹路径
var TEM_PATH = path.resolve(ROOT_PATH, 'app/templates');
module.exports = {
  //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
  entry: {
  	//三个入口文件，app, mobile和 vendors
    index: path.resolve(APP_PATH, 'index.js')
    // mobile: path.resolve(APP_PATH, 'mobile.js'),
    //添加要打包在commons里面的库
    // vendors: ['jquery', 'react', 'react-dom' ]
    // utils: ['./common/url', './common/formatDate']
  },
  //输出的文件名 合并以后的js会命名为bundle.js
  output: {
    path: BUILD_PATH,
    //注意 我们修改了bundle.js 用一个数组[name]来代替，他会根据entry的入口文件名称生成多个js文件，这里就是(app.js,mobile.js和vendors.js)
    //上hash这个参数生成Hash名称的script来防止缓存
    filename: '[name].[chunk:5].js'
  },
  externals: {
    'jquery': 'jQuery',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'antd': 'antd'
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    colors: true,
    port: 8888,
    proxy: {
      '/api/*': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false
      }
    }
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.less', '.scss', '.css']//后缀名自动补全
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.(png|jpg)$/,
        //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图
        // loader: 'url?limit=8192&name=images/[hash:8].[name].[ext]'
        loader: 'url?limit=8192&name=images/[name].[ext]'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        // include: APP_PATH,
        exclude: /node_modules/,
        query: {
          plugins: [ ["import", { libraryName: "antd", style: "css" }] ],// `style: true` 会加载 less 文件 
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      }
    ]
  },
  // babel: {
  //     presets: ['es2015', 'stage-0', 'react'],
  //     plugins: ['transform-runtime', ['import', {
  //       libraryName: 'antd',
  //       style: 'css'
  //     }]]
  // },
  plugins: [
    // new webpack.DefinePlugin({
    //     'process.env': {
    //         NODE_ENV: JSON.stringify('production') //定义生产环境
    //     }
    // }),
  	
    //把入口文件里面的数组打包成verdors.js
    // new webpack.optimize.CommonsChunkPlugin('vendors','commons/vendors.js'),
    // new webpack.optimize.CommonsChunkPlugin(
    // {
    //   	names: ['vendors'],
    //     // filenames: ['vendors.js', 'utils.js'],
    //     // minChunks: 2
    // }),
    new ExtractTextPlugin('[name].css'),
    //创建了两个HtmlWebpackPlugin的实例，生成两个页面
    new HtmlwebpackPlugin({
      title: 'demo',
      template: path.resolve(TEM_PATH, 'index.html'),
      filename: 'index.html',
      //chunks这个参数告诉插件要引用entry里面的哪几个入口
      chunks: ['index'],
      //要把script插入到标签里
      inject: 'body'
    }),
    // new HtmlwebpackPlugin({
    //   title: 'Hello Mobile app',
    //   template: path.resolve(TEM_PATH, 'mobile.html'),
    //   filename: 'mobile/mobile.html',
    //   chunks: ['mobile/mobile', 'vendors', 'utils', 'antd'],
    //   inject: 'body'
    // }),
    // new OpenBrowserPlugin({
    //   url: 'http://127.0.0.1:8888'
    // }),
    new webpack.HotModuleReplacementPlugin()
    //这个使用uglifyJs压缩你的js代码
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false, // 去掉所有注释
    //   },
    //   compress: {
    //     warnings: false,
    //   }
    // })
  ]
};