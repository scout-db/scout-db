import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: ['projects/angular-ngrx-material-starter/e2e/src/**/*.cy.ts']
  },
  viewportHeight: 1024,
  viewportWidth: 1280
});
