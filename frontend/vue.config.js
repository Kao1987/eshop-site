const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const path = require('path');

module.exports = defineConfig({
    publicPath: process.env.NODE_ENV === 'production' ? '/ECshop/' : '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    transpileDependencies: true,

    chainWebpack: config => {
        config.plugin('define').tap(args => {
            const env = args[0]['process.env'];
            env.BASE_URL = JSON.stringify(process.env.NODE_ENV === 'production' ? '/ECshop/' : '/');
            env.VUE_APP_API_BASE_URL = JSON.stringify(
                process.env.NODE_ENV === 'production'
                    ? 'https://ecshop-backend.onrender.com/api'
                    : 'http://localhost:5002/api'
            );
            env.VUE_APP_CAROUSEL_IMAGE_BASE_URL = JSON.stringify(
                process.env.NODE_ENV === 'production'
                    ? 'https://ecshop-backend.onrender.com/api/img/carouselImages'
                    : 'http://localhost:5002/api/img/carouselImages'
            );
            env.VUE_APP_PRODUCT_IMAGE_BASE_URL = JSON.stringify(
                process.env.NODE_ENV === 'production'
                    ? 'https://ecshop-backend.onrender.com/api/img/products'
                    : 'http://localhost:5002/api/img/products'
            );
            return args;
        });
    },

    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@assets': path.resolve(__dirname, 'src/assets'),
            },
            fallback: {
                "crypto": require.resolve("crypto-browserify"),
                "stream": require.resolve("stream-browserify"),
                "util": require.resolve("util/"),
                "buffer": require.resolve("buffer/")
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
                __VUE_OPTIONS_API__: JSON.stringify(true),
                __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
            }),
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser'
            })
        ]
    },
    devServer: {
        historyApiFallback: true,
        port: 8081,
        proxy: {
            '/api': {
                target: process.env.NODE_ENV === 'production'
                    ? 'https://ecshop-backend.onrender.com'
                    : 'http://localhost:5002',
                changeOrigin: true
            }
        }
    },
    productionSourceMap: false,
});