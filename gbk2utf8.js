#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version('0.0.1')
  .option('-f, --fromDir', 'from gbk dir')
  .option('-t, --targetDir', 'target utf8 dir')
  .option('-e, --ext', 'java,html,php,txt,js')
  .option('-i, --info','copy dir from --fromDir to --targetDir, and convert --ext file to utf8')
  //.option('-, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

if (!program.args.length) program.help();

if (null==program.fromDir) {
  program.help();
}

if (null==program.targetDir) {
  program.help();
}



