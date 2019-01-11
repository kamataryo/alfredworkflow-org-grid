module.exports = (value, orgname, type) => {
  switch (type) {
  case 'number':
    return `https://calendar.google.com/calendar/b/${value}`
  default:
    return value
  }
}
