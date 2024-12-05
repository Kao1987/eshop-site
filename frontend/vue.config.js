const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require('path')
module.exports = defineConfig({
  publicPath: '/',
  outputDir:'dist',
  lintOnSave:false,
  transpileDependencies: true,
  configureWebpack: {
    resolve:{
      alias:{
        '@':path.resolve(__dirname, 'src')
      }
    },
    plugins:[
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      })
    ]
  },
  devServer:{
    port:8081,
    proxy:{
      '/api': {
          target:'http://localhost:5001',
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
          secure: false, // 如果使用 HTTPS，但目標未加密，設置為 false
          logLevel: 'debug',  // 增加此行來獲取更多的 debug 信息
          onError(err, req, res) {
            console.error('Proxy error:', err);
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            res.end('Something went wrong. And we are reporting a custom error message.');
          }
        },
      '/img':{
        target:'http://localhost:5001',
        changeOrigin:true,
        pathRewrite:{'^/api/img': '/img'},

      },
      '/static': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        pathRewrite:{'^/static': ''},

      },
    }
  },
  productionSourceMap: false  // 生產環境不生成 source map
})
