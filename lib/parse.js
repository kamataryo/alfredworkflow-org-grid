const path = require('path')

const parse = (value, orgname, serviceName = '') => {
  const isURL = /^.+:\/\/.+$/.test(value)
  const type = isURL ? 'url' : value === true ? true : typeof value

  let parser = x => x
  try {
    parser = require(path.join(__dirname, `parse-${serviceName}`))
  } catch (e) {}

  return parser(value, orgname, type)
}

module.exports = parse
