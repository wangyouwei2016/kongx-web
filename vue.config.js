// 基础路径 注意发布之前要先修改这里
let baseUrl = './'
module.exports = {
    baseUrl: baseUrl, // 根据你的实际情况更改这里
    lintOnSave: false,
    devServer: {
        publicPath: baseUrl // 和 baseUrl 保持一致
    },
    productionSourceMap: false,
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ],
    chainWebpack: (config) => {
        //忽略的打包文件
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            // 'element-ui': 'ELEMENT',
        })
        const entry = config.entry('app')
        entry
            .add('babel-polyfill')
            .end()
        entry
            .add('classlist-polyfill')
            .end()
        entry
            .add('@/mock')
            .end()
    },
    transpileDependencies: ['avue-plugin-transfer', 'avue-plugin-ueditor'],
    //配置转发代理
    devServer: {
        // proxy:'http://10.36.34.54:8520',
        proxy: {
            '/kongx': {
                target: 'http://localhost:8095/',
                ws: false,
                pathRewrite: {
                    '^/kongx': '/'
                }
            },
        }
    }
}
