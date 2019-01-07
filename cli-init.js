const fs = require('fs')
const { TEMPLATE_FILE_PATH, CONFIG_FILE_PATH } = require('./constants')

fs.readFile(CONFIG_FILE_PATH, (err, data) => {
  if (err && err.code === 'ENOENT') {
    fs.copyFile(TEMPLATE_FILE_PATH, CONFIG_FILE_PATH, err => {
      if (err) {
        console.log('failed')
        console.error(err)
      } else {
        console.log('success!')
        console.log('Please rewrite them for your organizations.')
        console.log('path: ' + CONFIG_FILE_PATH)
        console.log('---')
        console.log(data.toString('utf-8'))
      }
    })
  } else {
    console.log('You may have config file already.')
    console.log('Please rewrite them for your organizations.')
    console.log('path: ' + CONFIG_FILE_PATH)
    console.log('---')
    console.log(data.toString('utf-8'))
  }
})
