const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8123',
    supportFile: false,
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 900,
    viewportHeight: 760,
    defaultCommandTimeout: 8000
  }
});
