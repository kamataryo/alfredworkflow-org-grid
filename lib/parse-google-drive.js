module.exports = (value, orgname, type) => {
  switch (type) {
  case 'number':
    return `https://drive.google.com/drive/u/${value}`
  default:
    return value
  }
}
