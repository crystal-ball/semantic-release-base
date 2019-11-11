'use strict'

const { message } = require('./git-opts')

describe('Git plugin options config', () => {
  test('Git message is configured', () => {
    expect(message).toBe('Release: <%= nextRelease.version %> 🔖 [skip ci]')
  })
})
