'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const express =require('express')
const axios =require('axios')//先当于ajax
/*解决歌单host路径问题req读入，res输出*/
var app =express()//创建express实例
var apiRoutes =express.Router()//创建路由
app.use("api/",apiRoutes)//使用

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  
  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    host: process.env.HOST || config.dev.host,
    port: process.env.PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true,
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before(apiRoutes) {
      apiRoutes.get('/api/getDiscList',function (req, res) {
        var url='https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        /*params和url一起发送的参数；headers可以设置头部*/
        axios.get(url,{
          headers:{
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params:req.query//req.query获得数据
        }).then((response)=>{
          res.json(response.data)
        }).catch((err)=>{
          console.log(err)
        })
      }),
      apiRoutes.get('/api/lyric',function (req, res) {
        var url='https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        /*params和url一起发送的参数；headers可以设置头部*/
        axios.get(url,{
          headers:{
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params:req.query//req.query获得数据
        }).then((response)=>{
          var ret = response.data
          if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/
            var matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((err)=>{
          console.log(err)
        })
      }),
      apiRoutes.get('/api/getDisc',function (req, res) {
        var url='https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        /*params和url一起发送的参数；headers可以设置头部*/
        axios.get(url,{
          headers:{
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params:req.query//req.query获得数据
        }).then((response)=>{
          res.json(response.data)
        }).catch((err)=>{
          console.log(err)
        })
      })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }), 
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${config.dev.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
