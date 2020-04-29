'use strict'

// Note: this file absolutely could be inlined to the index.js, but it would
// ruin the consistency of the single line plugin definitions 😅

const message = `Release: <%= nextRelease.version %> 🔖 [skip ci]`

module.exports = { message }
