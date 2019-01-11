const path = require('path')

const parse = (arg, orgname, serviceName = '') => {
  const value = arg.value || arg // accept value or { value, description }
  const description = arg.description

  const isURL = /^.+:\/\/.+$/.test(value)
  const type = isURL ? 'url' : value === true ? true : typeof value

  let parser = x => x
  try {
    parser = require(path.join(__dirname, `parse-${serviceName}`))
  } catch (e) {}

  return { value: parser(value, orgname, type), description }
}

module.exports = parse
