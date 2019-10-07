# 🔮 Projects - Semantic Release Base

<p align="center">
  <a href="https://www.npmjs.com/package/@crystal-ball/semantic-release-base">
    <img src="https://img.shields.io/npm/v/@crystal-ball/semantic-release-base.svg?style=flat-square" alt="NPM version">
  </a>
  <a href="https://github.com/crystal-ball/semantic-release-base/actions?workflow=CI%2FCD">
    <img src="https://github.com/crystal-ball/semantic-release-base/workflows/CI%2FCD/badge.svg" alt="Build status" />
  </a>
  <a href="https://renovatebot.com/">
    <img src="https://img.shields.io/badge/Renovate-enabled-32c3c2.svg" alt="Dependency versions managed by Renovate" />
  </a>
  <a href="https://github.com/crystal-ball/semantic-release-base#zenhub">
    <img src="https://img.shields.io/badge/shipping_faster_with-ZenHub-5e60ba.svg?style=flat-square" alt="ZenHub" />
  </a>
  <a href="https://prettier.io/">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Prettier">
  </a>
  <a href="https://semantic-release.gitbook.io">
    <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic_release-e10079.svg" alt="Semantic Release">
  </a>

  <br />
  <a href="https://github.com/crystal-ball">
    <img src="https://img.shields.io/badge/%F0%9F%94%AE%E2%9C%A8-contains_magic-D831D7.svg" alt="Contains magic" />
  </a>
  <a href="https://github.com/crystal-ball/crystal-ball.github.io">
    <img src="https://img.shields.io/badge/%F0%9F%92%96%F0%9F%8C%88-full_of_love-F5499E.svg" alt="Full of love" />
  </a>
</p>

Package contains the shared base configs for automated release management with
Semantic Release. Included configurations will:

1. Analyze commits using the ESLint commit standards to determine a semver
   version
1. Generate release notes for the release
1. Generate changelog updates for the release
1. Update the `package.json` version and publish to NPM
1. Push a release commit and tag
1. Add a comment to Github issues and PRs resolved in the release

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

_Configuring Github Actions_

```yml
jobs:
  ci-cd:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Setup Node.js
        uses: actions/setup-node@v1
        with:
          node-version: '10'
      - name: Install
        run: npm install
        env:
          CI: true
      - name: Test
        run: npm test
      - name: Release
        if: success() && github.ref == 'refs/heads/master'
        run: npx semantic-release
        env:
          GH_TOKEN: ${{ secrets.SEMANTIC_GH_TOKEN }}
          NPM_TOKEN: ${{ secrets.SEMANTIC_NPM_TOKEN }}
```

_Configuring Travis_

```yml
deploy:
  provider: script
  skip_cleanup: true
  script:
    - npx semantic-release
```

## Changelog generation

- Commits with breaking changes will create a notes section

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
