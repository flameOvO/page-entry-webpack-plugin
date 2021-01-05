const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const debug = require('debug')('page-entry-webpack-plugin');
const htmlAssetsList = new Set();
// 一个 JavaScript 命名函数。
class pageEntryWebpackPlugin {

  constructor(options) {
    debug('pageEntryWebpackPlugin--------start');
    const defaultOptions = {
      filename: 'index.html',
      template: 'auto',
      params: {},
    }
    this.options = Object.assign(defaultOptions, options);
  }

  apply(compiler) {
    const self = this;

    this.options.template = this.getFullTemplatePath(this.options.template, compiler.context);

    const filename = this.options.filename;
    if (path.resolve(filename) === path.normalize(filename)) {
      this.options.filename = path.relative(compiler.options.output.path, filename);
    }
    
    compiler.hooks.emit.tapAsync('pageEntryWebpackPlugin', function(compilation, callback) {
      debug('pageEntryWebpackPlugin--------emit');
      if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
        compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('pageEntryWebpackPlugin', (htmlPluginData, cb) => {
          self.renderTemplate(compilation, htmlPluginData, cb);
        });
      } else {
        const hooks = HtmlWebpackPlugin.getHooks(compilation);
        hooks.afterEmit.tapAsync('pageEntryWebpackPlugin', (htmlPluginData, cb) => {
          self.renderTemplate(compilation, htmlPluginData, cb);
        });
      }
      callback();
    });

  }

    /**
   * Helper to return the absolute template path with a fallback loader
   * @param {string} template
   * The path to the template e.g. './index.html'
   * @param {string} context
   * The webpack base resolution path for relative paths e.g. process.cwd()
   */
  getFullTemplatePath (template, context) {
    if (template === 'auto') {
      template = path.resolve(context, 'src/index.ejs');
      if (!fs.existsSync(template)) {
        template = path.join(__dirname, 'default.ejs');
      }
    }
    // Resolve template path
    return template.replace(
      /([!])([^/\\][^!?]+|[^/\\!?])($|\?[^!?\n]+$)/,
      (match, prefix, filepath, postfix) => prefix + path.resolve(filepath) + postfix);
  }

  renderTemplate(compilation, htmlPluginData, callback) {
    debug('htmlPluginData', htmlPluginData.outputName);
    htmlAssetsList.add(htmlPluginData.outputName);
    const template = fs.readFileSync(this.options.template, 'utf-8');
    const html = ejs.render(template, {assets: Array.from(htmlAssetsList), pluginOptions: this.options});
  
    // 将这个列表作为一个新的文件资源，插入到 webpack 构建中：
    compilation.assets[this.options.filename] = {
      source: function() {
        return html;
      },
      size: function() {
        return html.length;
      }
    };
    callback();
  }
}
module.exports = pageEntryWebpackPlugin;