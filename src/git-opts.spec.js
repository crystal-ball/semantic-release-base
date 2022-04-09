'use strict'

const { message } = require('./git-opts.js')

describe('Git plugin options config', () => {
  it('Git message is configured', () => {
    expect(message).toBe('Release: <%= nextRelease.version %> 🔖 [skip ci]')
  })
})
