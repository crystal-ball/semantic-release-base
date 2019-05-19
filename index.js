'use strict'

const path = require('path')
// eslint-disable-next-line import/no-dynamic-require
const packageJSON = require(path.resolve(process.cwd, 'package.json'))

// Change the commit partial for ESLint to use `commit.short` and `commit.long`
// for hash references so the output is readable
const commitPartial = `* {{#if message}}{{message}}{{else}}{{header}}{{/if}}

{{~!-- commit hash --}} {{#if @root.linkReferences}}([{{commit.short}}]({{#if @root.host}}{{@root.host}}/{{/if}}{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}/{{@root.commit}}/{{commit.long}})){{else}}{{hash~}}{{/if}}

{{~!-- commit references --}}{{#if references}}, closes{{~#each references}} {{#if @root.linkReferences}}[{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}#{{this.issue}}]({{#if @root.host}}{{@root.host}}/{{/if}}{{#if this.repository}}{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}{{else}}{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}{{/if}}/{{@root.issue}}/{{this.issue}}){{else}}{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}#{{this.issue}}{{/if}}{{/each}}{{/if}}`

module.exports = {
  branch: 'master',
  // Option is passed to all plugins to configure using ESLint commit format
  preset: 'eslint',
  plugins: [
    '@semantic-release/commit-analyzer',
    [
      '@semantic-release/release-notes-generator',
      {
        writerOpts: {
          // Leaving this for reference: it's possible to manipulate the commit
          // data using a transform fn
          // transform: commit => {
          //   commit.isRad = true
          //   return commit
          // },
          commitPartial,
        },
      },
    ],
    '@semantic-release/release-notes-generator',
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
