module.exports = (value, orgname, type) => {
  switch (type) {
  case 'url':
    return value
  case true:
    return `https://${orgname}.slack.com`
  default:
    return `https://${value}.slack.com`
  }
}
