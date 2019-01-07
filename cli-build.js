yaml = require('js-yaml')
fs = require('fs')
const { CONFIG_FILE_PATH } = require('./constants')

const config = yaml.safeLoad(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'))

const {
  meta: { browser },
  organizations,
  grid
} = config
