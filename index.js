'use strict'

const path = require('path')
const fs = require('fs')
// eslint-disable-next-line import/no-dynamic-require
const packageJSON = require(path.resolve(process.cwd(), 'package.json'))

const mainTemplate = fs.readFileSync(
  path.resolve(__dirname, './templates/template.hbs'),
  { encoding: 'utf-8' },
)
const headerPartial = fs.readFileSync(path.resolve(__dirname, './templates/header.hbs'), {
  encoding: 'utf-8',
})
const commitPartial = fs.readFileSync(path.resolve(__dirname, './templates/commit.hbs'), {
  encoding: 'utf-8',
})

const formatHeader = (
  formattedHost,
  formattedRepo,
  { currentTag, date, isPatch, previousTag, title, version },
) => {
  const headerLevel = isPatch ? '###' : '##'

  let header = `${headerLevel} [${version}](${formattedHost}${formattedRepo}/compare/${previousTag}...${currentTag})`
  if (title) header += ` "${title}"`
  if (date) header += ` (${date})`
  return header
}

const formatCommit = commit => {
  const { message, header, references } = commit
  const formattedDescription = message || header
  const refsPrefix = references && references.length ? ', closes' : ''

  // Add a formattedRefs
  const formattedReferences = references.map(ref => ({
    formattedRef: `${ref.owner ? `${ref.owner}/` : ''}${
      ref.repository ? ref.repository : ''
    }#${ref.issue}`,
    formattedRepo:
      ref.owner || ref.repository
        ? `${ref.owner ? `${ref.owner}/` : ''}${ref.repository}`
        : null,
    ...ref,
  }))

  // Ref: [owner/repository#issue]()
  // owner+repository not defined for same repo close -> will be defined for closing
  // issue in another repo
  // org
  // repo

  // host?owner?repository/issue

  return {
    ...commit,
    formattedDescription,
    formattedReferences,
    refsPrefix,
  }
}

module.exports = {
  // branch: 'master',
  branch: 'feat/formatting',
  // Option is passed to all plugins to configure using ESLint commit format
  preset: 'eslint',
  plugins: [
    '@semantic-release/commit-analyzer',
    [
      '@semantic-release/release-notes-generator',
      {
        writerOpts: {
          // Leaving this for reference: it's possible to manipulate the commit
          // data using a transform fn
          transform: commit => {
            console.log(commit)
            console.log('COMMIT')

            return formatCommit(commit)
          },
          finalizeContext: (context /* , options, commits, keyCommit */) => {
            console.log('FINALIZE')
            const { host, owner, repository } = context

            const formattedHost = host ? `${host}/` : ''
            const formattedRepo = `${owner ? `${owner}/` : ''}${repository}`
            const formattedHeader = formatHeader(formattedHost, formattedRepo, context)

            return {
              ...context,
              formattedHost,
              formattedRepo,
              formattedHeader,
            }
          },
          mainTemplate,
          headerPartial,
          commitPartial,
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogTitle: `# ${packageJSON.name} changelog`,
      },
    ],
    // Create release notes and changelog updates before handling git/npm tasks
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
}

// // Overwrite the commit partial for ESLint to use `commit.short` and `commit.long`
// // for hash references so the output is readable
