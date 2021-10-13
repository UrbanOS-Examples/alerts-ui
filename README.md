# Alerts Dashboard

### Getting Started

-   `npm install` from the root of the repository will install the needed dependencies
-   In the extensions pane, search for `@recommended`, and install the recommended extensions
    -   All team code linting / formatting will happen upon saving
-   `npm run watch` will spin up the alerting-dashboard in watch mode (code changes will refresh)

### Testing

Endpoints are tested with jest and the supertest library. An example is available
in the `app.test.ts` file.

-   `npm run test:watch` will run all `*.test.ts` files in watch mode
-   `npm run view:coverage` will startup a server to serve the coverage report
    for you to view in your browser

### Deployment

Github Actions is used for our internal deployment, steps are documented in the
`.github/workflows` directory.
