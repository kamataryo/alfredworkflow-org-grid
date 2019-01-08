module.exports = (value, orgname, type) => {
  switch (type) {
  case 'number':
    return `https://console.cloud.google.com/home/dashboard?authuser=${value}`
  default:
    return value
  }
}
