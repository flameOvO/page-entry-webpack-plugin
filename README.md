# page-entry-webpack-plugin

本插件为了方便启动多页项目时，可以清晰的看到当前项目哪些页面是可访问的，免去开发者自己拼接路由的时间以及麻烦。
本插件依赖于htmlWebpackPlugin插件 (peerDependencies)。
本插件基于webpack4，支持htmlWebpackPlugin V3和V4。

## 安装

````bash
npm install --save-dev page-entry-webpack-plugin
````

## 使用

`webpack.config.js`
````javascript
  var PageEntryWebpackPlugin = require('page-entry-webpack-plugin'); 
  module.exports = {
    plugins: [
      new PageEntryWebpackPlugin()
    ]
  } 
````

## 参数说明
````javascript
/**
 * page-entry-webpack-plugin
 * @param {Object} options 
 * @param {Boolean} options.filename 输出的html文件名
 * @param {Array} options.template 需要渲染的模板文件（使用的是ejs）
 */
````

模板内可以得到的asserts（webpack构建的asserts）跟options（plugin传入的参数）;


