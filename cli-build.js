yaml = require('js-yaml')
fs = require('fs')
const permitation = require('./lib/permitation')
const parse = require('./lib/parse')
const { CONFIG_FILE_PATH, SHORT_SERVICE_NAMES } = require('./constants')

const config = yaml.safeLoad(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'))

const {
  meta: { browser },
  organizations,
  grid
} = config

const definedOrgnames = organizations.map(org => org.name)

const commands = {}

Object.keys(grid).forEach(orgname => {
  const services = grid[orgname]
  const shortOrgname = (organizations.find(org => org.name === orgname) || {})
    .short

  Object.keys(services)
    .filter(service => service[0] !== '_')
    .forEach(serviceName => {
      const url = parse(services[serviceName], orgname, serviceName)
      const shortServiceName = SHORT_SERVICE_NAMES[serviceName]

      commands[url] = permitation(
        [orgname, shortOrgname],
        [serviceName, shortServiceName]
      )
    })

  const customs = services._customs || {}
  Object.keys(customs).forEach(
    ({ url, name: serviceName, short: shortServiceName }) => {
      commands[url] = permitation(
        [orgname, shortOrgname],
        [serviceName, shortServiceName]
      )
    }
  )
})

console.log(commands)
