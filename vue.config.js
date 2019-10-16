const CopywebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

// The path to the CesiumJS source code（需要确保已经安装了cesium, npm install cesium）
const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {
  publicPath: './',
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      '/MapCache/': {
        target: 'http://10.20.90.100/',
        changeOrigin: true,
        // pathRewrite: { '^/servicess': '' }
      },

      '/services/api': {
        target: 'http://10.224.97.136/',
        changeOrigin: true
      },
      '/proxy/10.40.17.121:80/services/api': {
        target: 'http://10.40.17.121:80',
        changeOrigin: true,
        pathRewrite: {
          '^/proxy/10.40.17.121:80/': ''
        }

      },
      '/proxy/10.224.97.148/': {
        target: 'http://10.224.97.148',
        changeOrigin: true,
        pathRewrite: {
          '^/proxy/10.224.97.148/': ''
        }

      },
      '/proxy/10.224.97.146/': {
        target: 'http://10.224.97.146/',
        changeOrigin: true,
        pathRewrite: {
          '^/proxy/10.224.97.146': ''
        }
      },
      '/proxy/10.224.97.148:8100/': {
        target: 'http://10.224.97.148:8100/',
        changeOrigin: true,
        pathRewrite: {
          '^/proxy/10.224.97.148:8100': ''
        }
      },
      '/riverapi/': {
        target: 'http://10.28.16.175:8448/',
        changeOrigin: true
      },

      '/proxy/10.40.17.121:80/services/api': {
        target: 'http://10.40.17.121:80',
        changeOrigin: true,
        pathRewrite: {
          '^/proxy/10.40.17.121:80/': ''
        }

      },
      '/proxy/10.224.96.103:6556/': {
        target: 'http://10.224.96.103:6556/',
        changeOrigin: true,
        pathRewrite: {
          '^/proxy/10.224.96.103:6556': ''
        }
      },
      '/proxy/10.224.96.103:4444/': {
        target: 'http://10.224.96.103:4444/',
        changeOrigin: true,
        pathRewrite: {
          '^/proxy/10.224.96.103:4444': ''
        }
      },
    }

  },

  configureWebpack: {
    output: {
      // Needed to compile multiline strings in Cesium
      sourcePrefix: ''
    },
    amd: {
      // Enable webpack-friendly use of require in Cesium
      toUrlUndefined: true
    },
    node: {
      // Resolve node module use of fs
      fs: 'empty'
    },
    resolve: {
      alias: {
        // CesiumJS module name
        cesium: path.resolve(__dirname, cesiumSource)
      }
    },
    plugins: [
      // Copy Cesium Assets, Widgets, and Workers to a static directory
      new CopywebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
      new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
      new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('')
      })
    ],
  }
};