'use strict'

const path = require('path')
// eslint-disable-next-line import/no-dynamic-require
const packageJSON = require(path.resolve(process.cwd(), 'package.json'))

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

module.exports = { changelogTitle }
