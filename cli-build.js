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

const definedOrgnames = organizations.map(org => org.name)

const commands = {}

Object.keys(grid).forEach(orgname => {
  const services = grid[orgname]
  const shortOrgname = (organizations.find(org => org.name === orgname) || {})
    .short

  Object.keys(services)
    .filter(service => service[0] !== '_')
    .forEach(serviceName => {
      const { value: url, description } = parse(
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
          description: description || command.join(' ')
        }))
      }
    })
  ;(services._customs || []).forEach(
    ({
      url,
      name: serviceName,
      short: shortServiceName,
      description = 'custom'
    }) => {
      commands[url] = {
        uid: uuidv4(),
        values: permitation(
          [orgname, shortOrgname],
          [serviceName, shortServiceName]
        ).map(command => ({ command, uid: uuidv4(), description }))
      }
    }
  )
})

const uids = [
  ...Object.keys(commands).map(url => commands[url].uid),
  ...Object.values(commands)
    .map(({ values }) => values)
    .reduce((prev, current) => [...prev, ...current], [])
    .map(({ uid }) => uid)
]

const jsonPlist = {
  bundleid: '',
  category: 'Tools',
  createdby: 'Generator: Alfredworkflow org grid',
  description: '',
  disabled: false,
  name: 'Org Grid',
  connections: Object.keys(commands).reduce((prev, url) => {
    const destinationuid = commands[url].uid
    const keys = commands[url].values.map(({ uid }) => uid)
    return {
      ...prev,
      ...keys.reduce(
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
  }, {}),
  objects: [
    // list open url workflow destination
    ...Object.keys(commands).map(url => ({
      config: { browser: '', spaces: '', url, utf8: true },
      type: 'alfred.workflow.action.openurl',
      uid: commands[url].uid,
      version: 1
    })),
    // lsit key input workflow source
    //
    ...Object.values(commands)
      .map(({ values }) => values)
      .reduce((prev, current) => [...prev, ...current], [])
      .map(({ command, uid, description }) => ({
        config: {
          argumenttype: 1,
          keyword: command.join(' '),
          subtext: '',
          text: description,
          withspace: true
        },
        type: 'alfred.workflow.input.keyword',
        uid,
        version: 1
      }))
  ],
  readme: '',
  uidata: uids.reduce(
    (prev, uid) => ({
      ...prev,
      [uid]: {
        xpos: Math.floor(Math.random() * 1000),
        ypos: Math.floor(Math.random() * 1000)
      }
    }),
    {}
  ),
  webaddress: ''
}

fs.writeFileSync(
  './dist/info.plist',
  // '~/Library/Application\\ Support/Alfred\\ 3/Alfred.alfredpreferences/workflows/org-grid.alfredworkflow',
  plist.build(jsonPlist)
)
