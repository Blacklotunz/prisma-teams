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
Code structure was kept simple and straightforward but it can be improved. The code is organized in the following way:
- app: contains the app source code
    - data: 
        - data.ts: contains the data models and the data access functions
        - models: contains the type definitions and typeguards for each data model. Also includes adaptor functions to convert between db data and business logic models
    - routes: contains the app routes
- db: contains the database schema definition and the seed file to initialize the database with base data. (Docker will use the `init-db.sh` script to initialize the database)


### Design/technical decisions made

- Teams relationships were modeled as tree with a root node as placeholder for the higher level of teams that do not report to any other team.
    - Teams relationships are stored in the `team_relationships` table. The SQL check constraint `CHECK (parent_team_id != child_team_id)` prevents circular references.
- The relationship between teams and members is stored in a junction table (`team_members`) that contains the team id, the member id and the member title. This allows to:
    - Store additional information about the team membership (like the member title)
    - This does not prevent a single member from being a member of multiple teams.
    - We prevent duplicate memberships to the same team by adding a unique constraint on the `(team_id, member_id)` columns.
- Manager information is stored directly in the team table using a foreign key to the member table. This allows to easily query and update the manager of a team without the need for transactions. The integrity between team and member is kept by the foreign key constraint. The limitation is that there can be only a single manager per team.
- With the current implementation there's no constraint to prevent a manager from being part of the team. E.g. a manager can be part of another team.

### Query design decisions

- `getTeamByID` returns a team object with a `parent` property that contains the parent team id and name. This is done to avoid a second query to get the parent team name. 
- `getChildrenRecursive` recursively query the paren/child relatioship table (`team_relationships`) to return all the the subtree starting from a parent node. In order to limit the number of recursive calls, the function accepts a `maxLevel` parameter that defaults to 100. This is a trade-off between performance and the risk of long running queries in case of *highly* nested teams.
- `getPossibleParents` returns all the teams that can be a parent of the team with the given id. This is done re-using the `getChildrenRecursive` function and filtering out the subtree that has the current team as root.

### Non functional improvements

- Add unit tests (requires investigation on testing Remix components) and end-to-end tests (with something like puppeteer)
- Improve the Error handling and logging (while 404 errors are catched by the `$` route, There's no real error handling. I opnly provided a generic `ErrorBoundary` in the root component that will catch every kind of error happening in the app). E.g. Errors in the data access layer do not return a specific `Error` type.
- Improve data mapping between db and business logic model (improving the layer of abstraction between db data model and business logic model)
- Handle loss of connection to the db (currently the app will crash if the db connection is lost)

### Functional improvements

- Add a search bar to the teams page for a quick search across all teams
- Create or delete members and teams