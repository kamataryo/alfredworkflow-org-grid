yaml = require('js-yaml')
fs = require('fs')
const plist = require('plist')
const uuidv4 = require('uuid/v4')
const permitation = require('./lib/permitation')
const parse = require('./lib/parse')
const { CONFIG_FILE_PATH, SHORT_SERVICE_NAMES } = require('./constants')

const config = yaml.safeLoad(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'))

const {
  meta: { browser },
  organizations,
  grid
} = config

const commands = {}

Object.keys(grid).forEach(orgname => {
  const services = grid[orgname]
  const shortOrgname = (organizations.find(org => org.name === orgname) || {})
    .short

  Object.keys(services)
    .filter(service => service[0] !== '_')
    .forEach(serviceName => {
      const { value: url, description: subtext } = parse(
        services[serviceName],
        orgname,
        serviceName
      )
      const shortServiceName = SHORT_SERVICE_NAMES[serviceName]

      commands[url] = {
        uid: uuidv4(),
        values: permitation(
          [orgname, shortOrgname],
          [serviceName, shortServiceName]
        ).map(command => ({
          command,
          uid: uuidv4(),
          subtext,
          text: command.join(' ')
        }))
      }
    })
  ;(services._customs || []).forEach(
    ({
      url,
      name: serviceName,
      short: shortServiceName,
      description: subtext
    }) => {
      commands[url] = {
        uid: uuidv4(),
        values: permitation(
          [orgname, shortOrgname],
          [serviceName, shortServiceName]
        ).map(command => ({
          command,
          uid: uuidv4(),
          subtext,
          text: command.join(' ')
        }))
      }
    }
  )
})

const connections = Object.keys(commands).reduce((prev, url) => {
  const destinationuid = commands[url].uid
  const uids = commands[url].values.map(({ uid }) => uid)
  return {
    ...prev,
    ...uids.reduce(
      (prev, key) => ({
        ...prev,
        [key]: [
          {
            destinationuid,
            modifiers: 0,
            modifiersubtext: '',
            vitoclose: false
          }
        ]
      }),
      {}
    )
  }
}, {})

// list open url workflow destination
const urlObjects = Object.keys(commands).map(url => ({
  config: { browser: '', spaces: '', url, utf8: true },
  type: 'alfred.workflow.action.openurl',
  uid: commands[url].uid,
  version: 1
}))

// lsit key input workflow source
const inputObjects = Object.values(commands)
  .map(({ values }) => values)
  .reduce((prev, current) => [...prev, ...current], [])
  .map(({ command, uid, text, subtext = '' }) => ({
    config: {
      argumenttype: 1,
      keyword: command.join(' '),
      text: command.join(' '),
      subtext,
      withspace: true
    },
    type: 'alfred.workflow.input.keyword',
    uid,
    version: 1
  }))

const uids = [
  ...Object.keys(commands).map(url => ({
    value: commands[url].uid,
    type: 'openurl'
  })),
  ...Object.values(commands)
    .map(({ values }) => values)
    .reduce((prev, current) => [...prev, ...current], [])
    .map(({ uid }) => ({ value: uid, type: 'command' }))
]

const uidata = uids.reduce((prev, { value: uid, type }, i) => {
  return {
    ...prev,
    [uid]: {
      xpos: type === 'command' ? 5 : 405,
      ypos: i * 105
    }
  }
}, {})

const jsonPlist = {
  bundleid: '',
  category: 'Tools',
  createdby: 'Generator: Alfredworkflow Org Grid',
  description: 'Your organizations alfredworkflow shortcuts.',
  disabled: false,
  name: 'Org Grid',
  connections,
  objects: [...urlObjects, ...inputObjects],
  uidata,
  readme: '',
  webaddress: ''
}

fs.writeFileSync(
  './dist/info.plist',
  // '~/Library/Application\\ Support/Alfred\\ 3/Alfred.alfredpreferences/workflows/org-grid.alfredworkflow',
  plist.build(jsonPlist)
)
