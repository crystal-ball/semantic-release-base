# Notes

## How it works

1. Package `@semantic-release/release-notes-generator` calls the
   `conventional-changelog` package
2. Conventional Changelog will parse the commits with
   `conventional-commits-parser` into a JSON context
3. Conventional Changelog will pipe the context through the
   `conventional-changelog-writer`

## Commit groups

Each of the commit tags will create a commit group, they are included on the
context like:

```js
{
  commitGroups: [
    { title, 'New', commits: [/* ... */] }
  ]
}
```

## Commits parsing

Each commit message has the following parts:

```
<merge> -> merge commit header
<header> -> mandatory commit header
<body> -> longer description for commit
<footer> -> additional notes, eg breaking changes
```

#### Commit header parsing

The conventional changelog by default will parse commit headers as:

`<type>(<scope>): <subject>`

The ESLint preset uses slightly different fields:

`<tag>: <message>`

## Transforms

Breaking changes are transformed to notes, eg:

```
Breaking: This test file is GONE

Adding a breacking change hopefully

BREAKING CHANGE: Removed this important file
```

will create: notes: [ { title: 'BREAKING CHANGE', text: 'Removed this important
file' } ],

This is configured by the parser opts `noteKeywords`, which is defaulted to only
`['BREAKING CHANGE']`

## Features

- Custom templates for release notes/changelog
- Header is h2 for release and h3 for patch releases

## Next

- How to set a release title?

* NOTE: Other templates check the `context.linkCompare` before including a
* link with the release version... but that should always happen for crystal
* ball projects... I think...

```js
const context = {
  // --- Semver info ---
  version, // Release version
  currentTag, // Current release tag
  previousTag, // Previous semver tag

  // --- Repo info ---
  host, // Github host
  owner, // Repo org
  repository, // Repo name

  // --- Link values ---
  // Include values for commit and issue even though they're not used in templates to
  // ensure that linkCompare and linkReferences are truthy
  commit, // url value for /commit/
  issue, // url value for /issues/
  // Should the release compare link be included? Defaults to true and checks for
  // a previousTag and currentTag
  linkCompare,
  // Should references in changelog have links? Defaults to true and checks for
  // a repo url, context.commit and context.issue
  linkReferences,

  // --- Details ---
  isPatch, // True for patch releases
  // date, title, repoUrl
}
```

```js
const commit = {
  commit: {
    long: '8d14946c50464dcf99cf5a9bd701262b2e3a2b4a',
    short: '8d14946',
  },
  tree: { long: '2e03d838bf38015fa1f33a100ff979d124b97f99', short: '2e03d83' },
  author: {
    name: 'Dan Hedgecock',
    email: 'hedgecock.d@gmail.com',
    date: '2019-05-19T18:34:30.000Z',
  },
  committer: {
    name: 'Dan Hedgecock',
    email: 'hedgecock.d@gmail.com',
    date: '2019-05-19T18:34:30.000Z',
  },
  // --- Commit header ---
  header: 'New: Totally rad new feature',
  tag: 'New',
  message: 'Totally rad new feature',

  // --- Commit body (longer description) ---
  body: 'Long description for this feature',
  hash: '8d14946c50464dcf99cf5a9bd701262b2e3a2b4a',
  gitTags: '(origin/feat/formatting)',
  committerDate: '2019-05-19T18:34:30.000Z',
  merge: null,
  footer: 'closes #87',
  notes: [],
  references: [
    {
      action: 'Closes',
      owner: null,
      repository: null,
      issue: '87',
      raw: '#87',
    },
  ],
  mentions: [],
  revert: null,
  // --- Ignored conventional changelog fields
  // type, scope, subject
}
```

Include a `BREAKING CHANGES:` footer in a commit to render the release notes
section, where the message for the breaking change will be included in the notes
section.

Include a `RELEASE NOTES:` footer in a commit to render the release notes
section, where the message for the release notes will be included in the notes
section.

## Reference

- The `release-notes-genetaor`:
  https://github.com/semantic-release/release-notes-generator
- The `conventional-commits-parser` has the options for how commits are parsed
  into data structures:
  https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser
- The `conventional-changelog-writer` has the options for how the changelog is
  written:
  https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer
- The ESLint preset:
  https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-eslint
