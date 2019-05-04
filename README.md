# 🔮 Fellowship Semantic Release Base

<p align="center">
  <a href="https://travis-ci.com/crystal-ball/semantic-release-base">
    <img src="https://travis-ci.com/crystal-ball/semantic-release-base.svg?branch=master" alt="Build">
  </a>
  <a href="https://www.npmjs.com/package/@crystal-ball/semantic-release-base">
    <img src="https://img.shields.io/npm/v/@crystal-ball/semantic-release-base.svg?style=flat-square" alt="current version">
  </a>
  <a href="https://github.com/prettier/prettier" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Prettier">
  </a>
  <a href="https://github.com/semantic-release/semantic-release" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic_release-e10079.svg" alt="managed by semantic release">
  </a>
  <a href="https://www.zenhub.com/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/shipping_faster_with-ZenHub-5e60ba.svg?style=flat-square" alt="ZenHub" />
  </a>
  <img src="https://img.shields.io/badge/%20%20%F0%9F%A6%84%F0%9F%8C%88-made_with_love-ce068b.svg" alt="made with love" />
</p>

Package contains the shared base configs for automated release management with
Semantic Release. Included configurations will:

- Analyze commits using the ESLint commit standards to determine a semver
  version
- Generate release notes for the release
- Generate changelog updates for the release
- Update the `package.json` version and publish to NPM
- Push a release commit and tag
- Add a comment to Github issues and PRs resolved in the release

## Setup

_1. Install_

```sh
npm i -D @crystal-ball/semantic-release-base
```

_2. Update `package.json`_

```
{
  "release": {
    "extends": ["@crystal-ball/semantic-release-base"]
  }
}
```

## CI/CD configuration

Releases should be configured to trigger on change to master branch in CI/CD.
Configurations must be set as environment values including:

- `GH_TOKEN` Github token
- `NPM_TOKEN` NPM token

_Configuring Travis_

```
deploy:
  provider: script
  skip_cleanup: true
  script:
    - npx semantic-release
```

## Included plugins

- [@semantic-release/commit-analyzer][]
- [@semantic-release/release-notes-generator][]
- [@semantic-release/changelog][]
- [@semantic-release/git][]
- [@semantic-release/github][]
- [@semantic-release/npm][]

 <!-- Links -->

[@semantic-release/commit-analyzer]:
  https://github.com/semantic-release/commit-analyzer
[@semantic-release/release-notes-generator]:
  https://github.com/semantic-release/release-notes-generator
[@semantic-release/changelog]: https://github.com/semantic-release/changelog
[@semantic-release/git]: https://github.com/semantic-release/git
[@semantic-release/github]: https://github.com/semantic-release/github
[@semantic-release/npm]: https://github.com/semantic-release/npm
