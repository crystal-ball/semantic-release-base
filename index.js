'use strict'

const { changelogTitle } = require('./lib/changelog-title')
const { writerOpts, parserOpts } = require('./lib/release-notes-generator-opts')

module.exports = {
  branch: 'master',
  // Option is passed to all plugins to configure using ESLint commit format
  preset: 'eslint',
  plugins: [
    '@semantic-release/commit-analyzer',
    ['@semantic-release/release-notes-generator', { parserOpts, writerOpts }],
    ['@semantic-release/changelog', { changelogTitle }],
    // ⚠️ Release notes and changelog must be created before running git+npm tasks
    '@semantic-release/git',
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
}
