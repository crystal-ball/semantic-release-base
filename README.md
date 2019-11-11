<div align="right">
  <h1>
    <img height=75 src="./docs/assets/readme-header.png" alt="Crystal Ball Projects documentation"/>
  </h1>

  <!-- prettier-ignore-start -->
  <a href="https://www.npmjs.com/package/@crystal-ball/semantic-release-base">
    <img src="https://img.shields.io/npm/v/@crystal-ball/semantic-release-base" alt="Package version" valign="text-top"/>
  </a>
  <a href="https://www.npmjs.com/package/@crystal-ball/semantic-release-base">
    <img src="https://img.shields.io/npm/dt/@crystal-ball/semantic-release-base?color=blue" alt="NPM downloads" valign="text-top" />
  </a>
  <a href="https://github.com/crystal-ball/semantic-release-base/actions?workflow=CI%2FCD">
    <img src="https://github.com/crystal-ball/semantic-release-base/workflows/CI%2FCD/badge.svg" alt="Build status" valign="text-top" />
  </a>
  <a href="https://snyk.io/test/github/crystal-ball/semantic-release-base?targetFile=package.json">
    <img src="https://snyk.io/test/github/crystal-ball/semantic-release-base/badge.svg?targetFile=package.json" alt="Known vulnerabilities" valign="text-top" />
  </a>
  <a href="https://codeclimate.com/github/crystal-ball/semantic-release-base/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/49c5480dedecf35fbd72/test_coverage" alt="Test coverage" valign="text-top" />
  </a>
  <a href="https://codeclimate.com/github/crystal-ball/semantic-release-base/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/49c5480dedecf35fbd72/maintainability" alt="Maintainability" valign="text-top" />
  </a>
  <code>:status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code>

  <br />
  <a href="https://renovatebot.com/">
    <img src="https://img.shields.io/badge/Renovate-enabled-32c3c2.svg" alt="Renovate" valign="text-top" />
  </a>
  <a href="https://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/Commitizen-%E2%9C%93%20friendly-10e67b" alt="Commitizen friendly" valign="text-top" />
  </a>
  <a href="https://github.com/crystal-ball/semantic-release-base#workspaces/-projects-5b88b5c9af3c0a2186966767/board?repos=184947287">
    <img src="https://img.shields.io/badge/ZenHub-managed-5e60ba.svg" alt="ZenHub" valign="text-top" />
  </a>
  <a href="https://semantic-release.gitbook.io/semantic-release/">
    <img src="https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-semantic_release-e10079.svg" alt="Semantic Release" valign="text-top"/>
  </a>
  <a href="./CODE_OF_CONDUCT.md">
    <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0-de8cf2.svg" alt="Contributor Covenant" valign="text-top" />
  </a>
  <code>:integrations</code>

  <br />
  <a href="https://github.com/crystal-ball">
    <img src="https://img.shields.io/badge/%F0%9F%94%AE%E2%9C%A8-contains_magic-D831D7.svg" alt="Contains magic" valign="text-top" />
  </a>
  <a href="https://github.com/crystal-ball/crystal-ball.github.io">
    <img src="https://img.shields.io/badge/%F0%9F%92%96%F0%9F%8C%88-full_of_love-F5499E.svg" alt="Full of love" valign="text-top" />
  </a>
  <code>:flair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code>
  <!-- prettier-ignore-end -->

  <h1></h1>
  <br />
  <p align="center">
    <em>Documentation and standards for managing Crystal Ball Projects 🔮✨</em>
  </p>
  <br />
</div>

---

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
