## Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)

### Install dependencies
From the root folder install the node dependencies
```sh
npm i
```

### Build and start the Docker container that will host the database
```sh
npm run build-db && npm run start-db
```
Make sure the database is running before starting the app
```sh
docker container ls
```

### Build and start the app
```sh
npm run build-app && npm run start-app-dev
```

The command will print the url of the app in the console


### File structure description

- app: contains the app source code
    - data: 
        - data.ts: contains the data models and the data access functions
        - models: contains the type definitions and typeguards for each data model. Also includes adaptor functions to convert between db data and business logic models
    - routes: contains the app routes
- db: contains the database schema definition and the seed file to initialize the database with base data. (Docker will use the `init-db.sh` script to initialize the database)


### Non functional improvements

- Add unit tests (requires investigation on testing Remix components) and end-to-end tests (with something like puppeteer)
- Improve the Error handling and logging (while 404 errors are catched by the `$` route, There's no real error handling. I opnly provided a generic `ErrorBoundary` in the root component that will catch every kind of error happening in the app)
- Improve data mapping between db and business logic model (improving the layer of abstraction between db data model and business logic model)
- Improve db connection handling and add support for transactions (currently the app relies on db.pool.query which is handy to handle connections but it doesn't allow for transactions-based operations)
- Handle loss of connection to the db (currently the app will crash if the db connection is lost)

### Functional improvements

- Add a search bar to the teams page for a quick search across all teams