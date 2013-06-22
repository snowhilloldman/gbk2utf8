#!/usr/bin/env node

/**
 * 将一个目录里的文件，拷贝到另一个目录里，并将指定后缀的文件，从gbk转换到utf8
 */

var program = require('commander')
  , fs = require('fs')
  , async = require('async')
  , glob = require('glob')
  , join = require('path').join
  , mkdirp = require('mkdirp')
  , Emitter = require('events').EventEmitter


program
  .version('0.0.1')
  .option('-f, --fromDir <path>', 'from gbk dir')
  .option('-t, --targetDir <path>', 'target utf8 dir')
  .option('-e, --ext', 'java,html,php,txt,js')
  .option('-i, --info','copy dir from --fromDir to --targetDir, and convert --ext file to utf8')
  .parse(process.argv);

console.log(program);

if (null==program.fromDir) {
  program.help();
}

if (null==program.targetDir) {
  program.help();
}

console.log(program);


glob('**/*', { cwd: program.fromDir, dot: true, mark: true }, function (err, paths) {
  console.log(paths);

});


