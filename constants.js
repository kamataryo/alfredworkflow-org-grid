const path = require('path')

const CONFIG_FILE_NAME = '.alfredworkflow-org-grid.config.yaml'
const TEMPLATE_FILE_PATH = path.join(__dirname, CONFIG_FILE_NAME)
const CONFIG_FILE_PATH = path.join(process.env['HOME'], CONFIG_FILE_NAME)

const SHORT_SERVICE_NAMES = {
  github: 'gh',
  gmail: 'gm',
  slack: 'sl',
  'google-calendar': 'ca',
  'google-drive': 'gd',
  backlog: 'bl'
}

module.exports = {
  CONFIG_FILE_NAME,
  TEMPLATE_FILE_PATH,
  CONFIG_FILE_PATH,
  SHORT_SERVICE_NAMES
}
