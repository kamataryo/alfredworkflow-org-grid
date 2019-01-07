module.exports = (value, orgname, type) => {
  switch (type) {
  case 'url':
    return value
  case true:
    return `https://${orgname}.backlog.jp/`
  default:
    return `https://${value}.backlog.jp/`
  }
}
