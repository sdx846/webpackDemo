# webpackDemo
1.webpack学习demo
2.手写webpack原理：node bundle.js即可查看bundle.js执行结果
    .获取主模块内容；
    .分析模块：安装@babel/parser包（模块内容转AST语法树）；
    .对模块内容进行处理：安装@babel/traverse包（遍历AST收集依赖即import from的值）；安装@babel/core和@babel/preset-env包 （es6转ES5）；
    .递归所有模块
    .生成最终代码