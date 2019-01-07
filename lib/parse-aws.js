module.exports = (value, orgname, type) => {
  switch (type) {
  case 'url':
    return value
  case true:
    return `https://${orgname}.signin.aws.amazon.com/console/`
  default:
    return `https://${value}.signin.aws.amazon.com/console/`
  }
}
