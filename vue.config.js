let path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    indexPath: 'index.html',
    filenameHashing: false,
    pages: undefined,
    parallel: require('os').cpus().length > 1,
    runtimeCompiler: false,
    // transpileDependencies: ['vue-echarts', 'resize-detector'],WWW-Authenticate
    productionSourceMap: false,
    //  crossorigin:true,
    integrity: false,
    devServer: {
        //����
        host: '10.8.0.59',
        port:8080,
        historyApiFallback: true,
        hot: true,
        hotOnly: true,
        proxy: {
            '/digest': {
                target:'http://10.8.0.62',
                changeOrigin: true,
            },
            '/t8s': {
                target:'http://10.8.0.62',
                changeOrigin: true,
            },
        },
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('common', resolve('src/common'))
            .set('components', resolve('src/components'))
            .set('plugins', resolve('src/plugins'))
            .set('mixin', resolve('src/mixin'))
            .set('store', resolve('src/store'))
            .set('layout', resolve('src/layout'))
            .set('form-ui', resolve('src/form-ui'))
            .set('h5player', resolve('../h5player/packages/CVPlayer_plugins/src/index.js'));
    },
};
