const fs = require('fs')
const { CONFIG_FILE_PATH } = require('./constants')

fs.unlink(CONFIG_FILE_PATH, (err, data) => {
  if (err) {
    console.error('Maybe no config file found.')
  } else {
    console.log('config file have been deleted successfully.')
  }
})
