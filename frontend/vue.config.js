const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require('path')
module.exports = defineConfig({
  publicPath: '/',
  outputDir:'../backend/public',
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
    historyApiFallback: true,
    proxy:{
      '/api':{
        target:'http://localhost:5001',
        changeOrigin:true,
        pathRewrite:{'^/api': ''},
      },
      '/img':{
        target:'http://localhost:5001',
        changeOrigin:true,
      }
    }
  },
  productionSourceMap: false  // 生產環境不生成 source map
})
