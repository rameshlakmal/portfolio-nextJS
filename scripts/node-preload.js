// Preloaded by NODE_OPTIONS before Gatsby boots.
// Gatsby v3 (and some deps) can attach >10 listeners to a single stream,
// which triggers Node's default MaxListeners warning. Bump the default to
// keep builds/dev output clean without hiding other warnings.

const events = require('events');

events.defaultMaxListeners = 50;
process.setMaxListeners(50);
