#!/usr/bin/env node

const program = require('commander')
const { version, description } = require('./package.json')

program
  .version(version)
  .description(description)
  .command('init', 'create config for org grid alfred workflow')
  .command('build', 'build and install your org grid alfred workflow', {
    isDefault: true
  })
  .command('remove', 'remove Org Grid configfile')
  .parse(process.argv)
