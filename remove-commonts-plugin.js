//该自定义插件的目的：删除bundle.js中的注释
//emit：这个钩子在webpack即将向输出目录输出文件时执行
//插件要求有apply。webpack启动时调用。
class RemoveCommentsPlugin {
    apply (compiler) {
      compiler.hooks.emit.tap('RemoveCommentsPlugin', compilation => {
        // compilation => 可以理解为此次打包的上下文
        for (const name in compilation.assets) {
          if (name.endsWith('.js')) {
            const contents = compilation.assets[name].source()
            const noComments = contents.toString().replace(/\/\*{2,}\/\s?/g, '')
            compilation.assets[name] = {
              source: () => noComments,
              size: () => noComments.length
            }
          }
        }
      })
    }
  }
module.exports = RemoveCommentsPlugin;