module.exports = (value, orgname, type) => {
  switch (type) {
  case 'url':
    return value
  case true:
    return `https://github.com/${orgname}`
  default:
    return `https://github.com/${value}`
  }
}
