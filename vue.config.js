const { defineConfig } = require('@vue/cli-service')
const path = require('path')

const TerserPlugin = require('terser-webpack-plugin') // 去console插件
const CompressionWebpackPlugin = require('compression-webpack-plugin') // gzip压缩插件

const registerRouter = require('./backend/router')

const resolve = dir => path.join(__dirname, dir)

module.exports = defineConfig({
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-music/' : '/',
  // 输出文件目录
  outputDir: 'dist',
  // 用于嵌套生成的静态资产（js，css，img，fonts）的目录
  assetsDir: '',
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)
  indexPath: 'index.html',
  // 静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
  filenameHashing: true,
  // 以多页模式构建应用程序。
  pages: undefined,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // 是否使用包含运行时编译器的Vue核心的构建。
  runtimeCompiler: false,
  // 默认情况下babel-loader忽略其中的所有文件node_modules。
  transpileDependencies: [],
  // 生产环境sourceMap
  productionSourceMap: false,
  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性
  crossorigin: undefined,
  // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
  integrity: false,
  // webpack配置
  configureWebpack: config => {
    // config.name = name
    const plugins = [
      // 去console
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      // gzip压缩
      new CompressionWebpackPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          ['js', 'css'].join('|') +
          ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
      }),
      // brotli压缩
      new CompressionWebpackPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
    if (process.env.NODE_ENV === 'production') {
      config.plugins = [...config.plugins, ...plugins]
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  // css相关配置
  css: {
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {},
          javascriptEnabled: true
        },
        // 全局引入变量和 mixin
        additionalData: `
          @import "@/assets/styles/variables.less";
          @import "@/assets/styles/mixins.less";
        `
      }
    }
  },
  // webpack-dev-server配置
  devServer: {
    open: false, // 打开浏览器
    client: {
      overlay: {
        warnings: false,
        errors: false
      }
    },
    host: '0.0.0.0',
    port: 8080,
    https: false,
    proxy: null, // 设置代理
    onBeforeSetupMiddleware: ({ app }) => registerRouter(app)
  },
  // 使用ts-import-plugin parallel设置为false，原因参考https://www.jianshu.com/p/201ed7363a56
  parallel: false,
  pwa: {
    name: 'Chicken Music',
    description: 'Chicken Music By Vue 3.0',
    themeColor: '#222',
    msTileColor: '#222',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  },
  // 第三方插件选项
  pluginOptions: {
    lintStyleOnBuild: true,
    stylelint:
      {
        fix: true,
        files:
          'src/**/*.{vue,htm,html,css,sss,less,scss}',
        formatter:
          () => {}
      }
  }
})
