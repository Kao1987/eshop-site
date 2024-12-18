    const { defineConfig } = require('@vue/cli-service');
    const webpack = require('webpack');
    const path = require('path');

    module.exports = defineConfig({
    publicPath: '/ECshop/', // 設置基礎路徑
    outputDir: 'dist', // 打包輸出目錄
    lintOnSave: false, // 停止代碼 lint 檢查
    transpileDependencies: true, // 編譯依賴

    configureWebpack: {
        resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // 簡化引用 src 的路徑
        },
        },
        plugins: [
        new webpack.DefinePlugin({
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
            // 'process.env': {
            //     VUE_APP_API_BASE_URL: JSON.stringify(process.env.VUE_APP_API_BASE_URL),
            //     VUE_APP_IMAGE_BASE_URL: JSON.stringify(process.env.VUE_APP_IMAGE_BASE_URL)
            // }
        }),
        ],
        optimization: {
            splitChunks: {
                chunks: 'all',
                minSize: 20000,
                maxSize: 250000,
            }
        },
        // 資產大小警告
        performance: {
            hints: false,
        },
        // 加入 stats 設定為 'errors-only' 或 'minimal'
        stats: 'errors-only' // 只顯示錯誤訊息   
        // 或者使用 'minimal' 來顯示較少但不只有錯誤的資訊

    },

    devServer: {
        port: 8081, // 設置開發伺服器埠號
        proxy: {
            '/api': {
                target: 'http://localhost:5002',
                changeOrigin: true
            }
        }
    },

    productionSourceMap: false, // 生產環境不生成 source map
    assetsDir: 'static',
    });
