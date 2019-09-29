'use strict'

const changelogOpts = require('./lib/changelog-opts')
const gitOpts = require('./lib/git-opts')
const githubOpts = require('./lib/github-opts')
const releaseNotesGeneratorOpts = require('./lib/release-notes-generator-opts')

module.exports = {
  // Option is passed to all plugins to configure using ESLint commit format
  preset: 'eslint',
  plugins: [
    '@semantic-release/commit-analyzer',
    ['@semantic-release/release-notes-generator', releaseNotesGeneratorOpts],
    ['@semantic-release/changelog', changelogOpts],
    // ⚠️ Release notes and changelog must be created before running git+npm tasks
    '@semantic-release/npm',
    // ⚠️ Git task must be run after npm in order to update package.json version
    ['@semantic-release/git', gitOpts],
    ['@semantic-release/github', githubOpts],
  ],
}
