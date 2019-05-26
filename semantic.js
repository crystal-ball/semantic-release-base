'use strict'

const path = require('path')
// eslint-disable-next-line import/no-dynamic-require
const packageJSON = require(path.resolve(process.cwd(), './package.json'))

const { changelogWriterConfigs } = require('./lib/changelog-writer-configs')

const changelogTitle = `# ${packageJSON.name} changelog

This project strictly adheres to semver and will err on the side of releasing majors when
changes could possibly introduce breaking changes. This changelog is dynamically generated
with [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) configured
with [@crystal-ball/semantic-release-base](https://github.com/crystal-ball/semantic-release-base).

> Changelog tags
>
> - 💥 - Breaking change
> - 🔖 - Release notes
> - 💖 - New feature
> - ✨ - Updates
> - 🛠 - Fixes
`

// Update release notes parser options to add ability to include release notes
// in a commit with keyword `RELEASE NOTES`
const changelogParserConfigs = { noteKeywords: ['BREAKING CHANGE', 'RELEASE NOTES'] }

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
        parserOpts: changelogParserConfigs,
        writerOpts: changelogWriterConfigs,
      },
    ],
    ['@semantic-release/changelog', { changelogTitle }],
    // ⚠️ Required to create release notes and changelog updates before git+npm tasks
    '@semantic-release/git',
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
}
