'use strict'

const path = require('path')
// eslint-disable-next-line import/no-dynamic-require
const packageJSON = require(path.resolve(process.cwd(), './package.json'))

const { changelogWriterConfigs } = require('./lib/changelog-writer-configs')

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
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'RELEASE NOTES'],
        },
        writerOpts: changelogWriterConfigs,
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
