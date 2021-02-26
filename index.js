'use strict'

const changelogOpts = require('./src/changelog-opts')
const gitOpts = require('./src/git-opts')
const githubOpts = require('./src/github-opts')
const releaseNotesGeneratorOpts = require('./src/release-notes-generator-opts')

module.exports = {
  // Option is passed to all plugins to configure using ESLint commit format
  preset: 'eslint',
  branches: ['main', 'master'],
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
