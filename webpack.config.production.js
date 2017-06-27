var path = require('path');
var webpack = require('webpack');
// var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin"); //css单独打包
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css的插件
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
// var APP_PATH = path.resolve(ROOT_PATH, 'app/js');
var APP_PATH = path.resolve(ROOT_PATH, 'matchManage/js');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
//Template的文件夹路径
var TEM_PATH = path.resolve(ROOT_PATH, 'templates');



var config = module.exports = {
  //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
  entry: {
  	//三个入口文件，app, mobile和 vendors
    matchManage: path.resolve(APP_PATH, 'matchManage.js')
    // mobile: path.resolve(APP_PATH, 'mobile.js'),
    //添加要打包在commons里面的库
    // vendors: ['jquery', 'react', 'react-dom' ]
    // antd: ['antd']
    // utils: ['./common/url', './common/formatDate']
  },
  //输出的文件名 合并以后的js会命名为bundle.js
  output: {
    path: BUILD_PATH,
    //注意 我们修改了bundle.js 用一个数组[name]来代替，他会根据entry的入口文件名称生成多个js文件，这里就是(app.js,mobile.js和vendors.js)
    //上hash这个参数生成Hash名称的script来防止缓存
    // filename: '/js/[name].[chunkhash:6].js',
    // chunkFilename: "[name].[chunkhash:6].js",
    // filename: '[name].js',
    filename: '[name].[chunkhash:6].js',
    // chunkFilename: "[name].js",
  },
  externals: {
    'antd': 'antd',
    // 'react': 'React',
    // 'react-dom': 'ReactDOM',
    // 'jquery': 'jQuery'
  },
  devtool: 'cheap-module-source-map',
  // devServer: {
  //   historyApiFallback: true,
  //   hot: true,
  //   inline: true,
  //   colors: true,
  //   port: 8888,
  //   proxy: {
  //     '/api/*': {
  //         target: 'http://localhost:5000',
  //         secure: false
  //     }
  //   }
  // },
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
        loader: 'url?limit=8192&name=images/[hash:8].[name].[ext]'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        // include: APP_PATH,
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-runtime', ['import', {
            libraryName: 'antd',
            style: 'css'
          }]]
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
   //以下配置可以告诉 React 当前是生产环境，请最小化压缩 js ，即把开发环境中的一些提示、警告、判断通通去掉，直流以下发布之后可用的代码。
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production') //定义生产环境
        }
    }),
   
    // new webpack.DefinePlugin({ 
    //   'process.env':{ 
    //     'NODE_ENV': JSON.stringify(process.env.NODE_ENV) 
    //   } 
    // }),
  	
    //把入口文件里面的数组打包成verdors.js
    // new webpack.optimize.CommonsChunkPlugin('vendors','commons/vendors.js'),
    // new webpack.optimize.CommonsChunkPlugin(
    // {
    //   	names: ['vendors'],
    //     // filenames: ['vendors.js', 'utils.js'],
    //     filename: '/js/[name].[chunkhash:6].js',
    //     minChunks: Infinity
    // }),
    // new ExtractTextPlugin('/css/[name].[chunkhash:6].css'),
    // new ExtractTextPlugin('[name].css'),
    new ExtractTextPlugin('[name].[chunkhash:6].css'),
    //创建了两个HtmlWebpackPlugin的实例，生成两个页面
    // new HtmlwebpackPlugin({
    //   title: '推广管理',
    //   template: path.resolve(TEM_PATH, 'index.html'),
    //   filename: 'dist/tggl.html',
    //   //chunks这个参数告诉插件要引用entry里面的哪几个入口
    //   // chunks: ['posterManage', 'vendors'],
    //   chunks: ['extendManage'],
    //   //要把script插入到标签里
    //   inject: 'body'
    // }),
    new HtmlwebpackPlugin({
      // title: '奖品管理',
      template: path.resolve(TEM_PATH, 'index.html'),
      filename: 'matchManage.html',
      chunks: ['matchManage'],
      inject: 'body'
    }),
    // new HtmlwebpackPlugin({
    //   title: 'Hello Mobile app',
    //   template: path.resolve(TEM_PATH, 'dist.html'),
    //   filename: 'mobile/mobile.html',
    //   chunks: ['posterManage'],
    //   inject: 'body'
    // }),
    // new OpenBrowserPlugin({
    //   url: 'http://127.0.0.1:8888'
    // }),
    // new webpack.HotModuleReplacementPlugin(),
    //压缩css
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    }),
    //这个使用uglifyJs压缩你的js代码
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false, // 去掉所有注释
      },
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    })
  ]
};

/**
* 动态查找所有入口文件
*/
// var glob = require("glob")
// var files = glob.sync('./*/js/index.js');
// var newEntries = {};

// files.forEach(function(f){
//    var name = /.\/.*\/(js\/index)/.exec(f)[0];//得到./activityPrizeSet/js这样的文件名
//    newEntries[name] = f;
//    console.log("+",name);
//    console.log("+",f);
//    var plug = new HtmlwebpackPlugin({
//       // title: '奖品管理',
//       template: path.resolve(TEM_PATH, 'index.html'),
//       filename: name+'.html',
//       chunks: [name],
//       inject: 'body'
//     });

//    config.plugins.push(plug);
// });

// config.entry = Object.assign({}, config.entry, newEntries);