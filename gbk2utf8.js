#!/usr/bin/env node

/**
 * 将一个目录里的文件，拷贝到另一个目录里，并将指定后缀的文件，从gbk转换到utf8
 * https://github.com/bengourley/node-directory-copy/blob/master/directory-copy.js
 * https://github.com/visionmedia/commander.js/tree/master/examples
 * https://github.com/isaacs/node-glob
 */

var program = require('commander')
  , fs = require('fs')
  , path = require('path')
  , async = require('async')
  , glob = require('glob')
  , join = require('path').join
  , mkdirp = require('mkdirp')
  , _ = require('underscore')
  , exec_sync = require('exec-sync')
  , Emitter = require('events').EventEmitter;

function list(val) {
  return val.split(',');
}

program
  .version('0.0.1')
  .option('-f, --fromDir <path>', 'from gbk dir')
  .option('-t, --targetDir <path>', 'target utf8 dir')
  .option('-e, --ext <items>', 'java,html,php,txt,js', list)
  .option('-i, --info','copy dir from --fromDir to --targetDir, and convert --ext file to utf8')
  .parse(process.argv);


if (null==program.fromDir) {
  program.help();
}

if (null==program.ext) {
  program.help();
}

if (null==program.targetDir) {
  program.help();
}

//console.log(program);
//process.exit();


glob('**/*', { cwd: program.fromDir, dot: true, mark: true }, function (err, paths) {
  //console.log(paths);
  var dirs = [], files = [], excluded = [];

  paths.filter(function (path) {
    var exclude = excluded.some(function (ex) {
      return path.indexOf(ex) === 0
    })
    if (exclude) return
    if (/\/$/.test(path)) {
      dirs.push(join(program.targetDir, path))
    } else {
      files.push(
        { src: join(program.fromDir, path)
        , dest: join(program.targetDir, path)
        })
    }
  });

  async.forEach(dirs, mkdirp, function (err) {
    if (err) { 
      console.log(err);
      return ;
    }
  });

  async.forEach(files, function(file,done) {
    var filename = path.basename(file.src);
    if (_.indexOf(['.DS_Store','Thumbs.db'],filename)!=-1) {
      return ;
    }

    var extname = path.extname(file.src);
    if (extname.length>1) {
      extname = extname.substring(1);
    }
    if (_.indexOf(program.ext, extname)!=-1) {
      var cmd = 'iconv -c -f gb2312 -t utf8 '+file.src;
      console.log(cmd);
      var rs = exec_sync(cmd);
      //console.log(rs);
      var fd = fs.openSync(file.dest, 'w');
      fs.writeSync(fd, rs);
      fs.closeSync(fd);
    } else {
      console.log("copy file:"+file.dest);
      exec_sync ('cp -f '+file.src+' '+file.dest);
    }
  }, 
  function (err) {
    if (err) { 
      console.log(err);
      return ;
    }
  });

  console.log('done all!');
  //console.log(dirs);
  //console.log(files);
});


