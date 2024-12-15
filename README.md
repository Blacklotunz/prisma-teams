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

### Build and start the database
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