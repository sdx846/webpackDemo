const path = require('path')
//用于获取文件内容
const fs = require('fs')
//@babel/parser将获取到的模块内容,解析成AST语法树。有三个api,下面的parse这个API将我们提供的代码解析成完整的ECMAScript代码
const parser = require('@babel/parser')
//遍历AST，将用到的依赖收集起来。其实就是将用import语句引入的文件路径收集起来。我们将收集起来的路径放到deps里。
const traverse = require('@babel/traverse').default
//把获得的ES6的AST转化成ES5的AST,需要两个依赖@babel/core @babel/preset-env。
const babel = require('@babel/core')


const getModuleInfo = (file) => {
    const body = fs.readFileSync(file, 'utf-8');//获取模块文件内容
    const ast = parser.parse(body, {
        sourceType: 'module' //表示我们要解析的是ES模块
    });
    // console.log(ast);
    // console.log(ast.program.body);
    const deps = {}
    traverse(ast, {
        //ImportDeclaration 方法代表的是对type类型为ImportDeclaration的节点的处理。这里我们获得了该节点中source的value，也就是import后面的 './add' 和 './minus'。
        ImportDeclaration({ node }) {
            const dirname = path.dirname(file)
            // const abspath = './' + path.join(dirname, node.source.value)
            const abspath=dirname+'/'+path.basename(node.source.value)+'.js';
            deps[node.source.value] = abspath
        }
    })
    // console.log(deps);
    //transformFromAst将我们传入的AST转化成我们在第三个参数里配置的模块类型。
    const {code} = babel.transformFromAst(ast,null,{
        presets:["@babel/preset-env"]
    })
    const moduleInfo = {file,deps,code}
    return moduleInfo
}
// getModuleInfo("./src/index.js")
/**递归获取依赖：
*我们首先传入主模块路径
*将获得的模块信息放到temp数组里。
*外面的循环遍历temp数组，此时的temp数组只有主模块
*里面再获得主模块的依赖deps
*遍历deps，通过调用getModuleInfo将获得的依赖模块信息push到temp数组里。
**/ 
const parseModules = (file) =>{
    const entry =  getModuleInfo(file)
    const temp = [entry] 
    const depsGraph = {} 
    for (let i = 0;i<temp.length;i++){
        const deps = temp[i].deps
        if (deps){
            for (const key in deps){
                if (deps.hasOwnProperty(key)){
                    temp.push(getModuleInfo(deps[key]))
                }
            }
        }
    }
    temp.forEach(moduleInfo=>{
        depsGraph[moduleInfo.file] = {
            deps:moduleInfo.deps,
            code:moduleInfo.code
        }
    })
    return depsGraph
}
// parseModules("./src/index.js")
//定义这require函数，和exports对象。eval()执行时会用到。
const bundle = (file) =>{
    const depsGraph = JSON.stringify(parseModules(file))
    return `(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                eval(code)
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`

}
const content = bundle('./src/index.js')
//写入到我们的dist目录下
fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js',content)