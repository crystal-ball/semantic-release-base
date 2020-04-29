'use strict'

const path = require('path')
const fs = require('fs')
const assert = require('assert')

// Read in all the handlebars templates and partials
const hbsPartials = ['commit', 'header', 'main', 'notes'].reduce((acc, filename) => {
  acc[filename] = fs.readFileSync(
    path.resolve(__dirname, `../templates/${filename}.hbs`),
    { encoding: 'utf-8' },
  )
  return acc
}, {})

/**
 * Handles formatting a host, owner and repo into a base for the repo url
 */
const formatRepoUrlBase = (host, owner, repository) =>
  `${host ? `${host}/` : ''}${owner ? `${owner}/` : ''}${repository}`

/**
 * Format the release header
 */
const formatReleaseHeader = ({
  currentTag,
  date,
  host,
  isPatch,
  owner,
  previousTag,
  repository,
  title,
  version,
}) => {
  const repoUrlBase = formatRepoUrlBase(host, owner, repository)
  const headerLevel = isPatch ? '###' : '##'

  let header = `${headerLevel} [${version}](${repoUrlBase}/compare/${previousTag}...${currentTag})`
  if (title) header += ` ${title}`
  if (date) header += ` (${date})`
  return header
}

/**
 * Decorate each reference with: completeReference, referenceUrl
 */
const decorateReference = (ref, { host, owner, repository }) => {
  // Ref: [owner/repository#issue](host/owner/repository/issue)
  // Where owner && repository will not be defined for a same repo issue,
  // and will be defined for outside repo references
  const referenceBase = `${ref.owner ? `${ref.owner}/` : ''}${ref.repository || ''}`
  let referenceRepoUrlBase
  if (ref.owner || ref.repository) {
    referenceRepoUrlBase = formatRepoUrlBase(host, ref.owner, ref.repository)
  } else {
    referenceRepoUrlBase = formatRepoUrlBase(host, owner, repository)
  }

  return {
    ...ref,
    completeReference: `${referenceBase}#${ref.issue}`,
    referenceUrl: `${referenceRepoUrlBase}/issue/${ref.issue}`,
  }
}

/**
 * Decorate each commit with: commitUrl, shortHash
 */
const decorateCommit = (commit, { host, owner, repository }) => {
  const { hash, message, references } = commit

  // Ensure commit message exists b/c it's important
  if (!message) console.error(`Commit is missing a message!`, commit) // eslint-disable-line no-console

  return {
    ...commit,
    commitUrl: `${formatRepoUrlBase(host, owner, repository)}/commit/${hash}`,
    // Add a short version of hash for anchor text
    shortHash: hash.slice(0, 7),
    // Ensure commit message is capitalized
    message: message.slice(0, 1).toUpperCase() + message.slice(1),
    references: references
      ? references.map((ref) => decorateReference(ref, { host, owner, repository }))
      : null,
  }
}

const commitGroupOrder = [
  'Breaking',
  'New',
  'Update',
  'Fix',
  'Chore',
  'Docs',
  'Upgrade',
  'Build',
]

/**
 * Handle combining the non consumer impacting commit types into a single group
 */
const mergeCommitGroups = (commitGroups) => {
  const primaryGroupTitles = ['Breaking', 'New', 'Update', 'Fix']
  const decoratedCommitGroups = []
  const secondaryCommitGroup = { title: '', commits: [] }

  // Sort commit groups for deterministic order
  commitGroups.sort(
    (a, b) => commitGroupOrder.indexOf(a.title) - commitGroupOrder.indexOf(b.title),
  )

  // Step through commit groups ->
  // IF primary THEN push to primary groups unmodified
  // IF secondary THEN merge into secondary groups
  commitGroups.forEach((commitGroup) => {
    if (primaryGroupTitles.indexOf(commitGroup.title) !== -1) {
      decoratedCommitGroups.push(commitGroup)
    } else {
      const { title, commits } = commitGroup
      secondaryCommitGroup.title += secondaryCommitGroup.title.length
        ? `, ${title}`
        : title
      secondaryCommitGroup.commits = secondaryCommitGroup.commits.concat(commits)
    }
  })

  decoratedCommitGroups.push(secondaryCommitGroup)
  return decoratedCommitGroups
}

/**
 * Decorate the important commit group titles with an emoji
 */
const decorateCommitGroupTitle = (title) => {
  switch (title.toLowerCase()) {
    case 'breaking':
      return '💥 Breaking'
    case 'new':
      return '💖 New'
    case 'update':
      return '✨ Update'
    case 'fix':
      return '🛠 Fix'
    default:
      return title
  }
}

/**
 * Decorate the note group titles for better display
 */
const decorateNoteGroupTitle = (title) => {
  switch (title.toLowerCase()) {
    case 'breaking change':
      return '💥 Breaking Changes!'
    case 'release notes':
      return '🔖 Release Notes'
    default:
      return title
  }
}

// prettier-ignore
const groupsOrder = ['Breaking','New','Update','Fix','Docs','Build','Upgrade','Chore']

/**
 * Configs for the changelog writer
 */
const writerOpts = {
  // Commits are grouped by the tag
  groupBy: 'tag',
  // Groups are sorted by their title
  commitGroupsSort: (a, b) => groupsOrder.indexOf(a.title) > groupsOrder.indexOf(b.title),
  // Commits are sorted by tag then message?
  commitsSort: ['tag', 'message'],
  // Ensure that only properly formatted commits are formatting by using
  // transform as a filter
  transform: (commit) => {
    if (!commit.tag || typeof commit.tag !== `string`) return false
    return commit
  },
  // Handle decorating and preparing data to keep all logic out of the hbs
  // templates
  finalizeContext: (context /* , options, commits, keyCommit */) => {
    const { host, owner, repository } = context

    assert(Array.isArray(context.commitGroups), 'Commit groups must be an array')
    assert(Array.isArray(context.noteGroups), 'Note groups must be an array')

    const mergedCommitGroups = mergeCommitGroups(context.commitGroups)

    return {
      ...context,
      releaseHeader: formatReleaseHeader(context),
      commitGroups: mergedCommitGroups.map((commitGroup) => ({
        ...commitGroup,
        title: decorateCommitGroupTitle(commitGroup.title),
        commits: commitGroup.commits.map((commit) =>
          decorateCommit(commit, { host, owner, repository }),
        ),
      })),
      noteGroups: context.noteGroups.map((noteGroup) => ({
        ...noteGroup,
        title: decorateNoteGroupTitle(noteGroup.title),
      })),
    }
  },
  // Overwrite the primary hbs partials
  mainTemplate: hbsPartials.main,
  headerPartial: hbsPartials.header,
  commitPartial: hbsPartials.commit,
  // Registers custom partials
  partials: {
    notes: hbsPartials.notes,
  },
}

// Update release notes parser options to add ability to include release notes
// in a commit with keyword `RELEASE NOTES`
const parserOpts = { noteKeywords: ['BREAKING CHANGE', 'RELEASE NOTES'] }

module.exports = { writerOpts, parserOpts }
