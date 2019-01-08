module.exports = (value, orgname, type) => {
  switch (type) {
  case 'number':
    return `https://mail.google.com/mail/u/${value}/#inbox`
  default:
    return value
  }
}
