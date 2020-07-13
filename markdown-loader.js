const marked = require('marked');
module.exports=source=>{
    //加载到的模块内容
    console.log(source);
    //把.md内容转化为html
    const html = marked(source);
    const code = `export default ${JSON.stringify(html)}`;
    //返回值就是最终被打包的内容
    return code;
    // return console.log('hello .md');
}