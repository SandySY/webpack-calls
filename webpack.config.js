const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV  === 'development';
const config = require('./public/config')[isDev? 'dev' : 'build'];

module.exports = {
  // mode: "development",//"production",
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.jsx?$/,//匹配规则
        // loader: 'babel-loader',
        // use: ['babel-loader'],
        use:{
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  "corejs": 3
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.(le|c)ss$/,
        use: ['style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('autoprefixer')({
                  "overrideBrowserslist": [
                    ">0.25%",
                    "not dead"
                  ]
                })
              ]
            }
          }
        }, 'less-loader'],
        /*loader 的执行顺序是从右向左执行的，也就是后面的 loader 先执行，上面 loader 的执行顺序为: less-loader ---> postcss-loader ---> css-loader ---> style-loader
当然，loader 其实还有一个参数，可以修改优先级，enforce 参数，其值可以为: pre(优先执行) 或 post (滞后执行)。*/
        exclude: /node_modules/  //排除node_modules目录
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240, //10k 即资源大小小于 10K 时，将资源转换为 base64，超过 10K，将图片拷贝到 dist 目录
              esModule: false, //支持<img src={require('XXX.jpg')} />
              outputPath: 'assets',
              name: '[name]_[hash:6].[ext]'  //拷贝到dist的文件名
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /.html$/,
        use: 'html-withimg-loader'
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      config: config.template,
      minify: {
        removeAttributeQuotes: true,//是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      hash: true
    })
  ],
  devServer: {
    port: '3000', //默认是8080
    quiet: false, //默认不启用
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error
    overlay: false, //默认不启用
    clientLogLevel: "silent", //日志等级
    compress: true //是否启用 gzip 压缩
  },
  devtool: "source-map" //"cheap-module-eval-source-map"//开发环境下使用
}