import { defineConfig } from 'cypress';
// AWS exports
const awsConfig = require('./src/aws-exports.js');

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
  },
});
