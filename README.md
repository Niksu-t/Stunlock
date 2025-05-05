# Stunlock

Stunlock is a proprietary (perhaps source-available upon release) web application developed in part of a university course.

Stunlock is a web application consisting of a [client](client/README.md) built with Vite.js, and a [backend](BackEnd/README.md) built with Express.js. The backend handles all heavier loads, user information, data, business logic etc. The client is served by a [web server](server/README.md), which enables for example server side rendering and routing.

The application is hosted on a Ubuntu virtual machine with Apache2 serving as a reverse proxy.
 
## How to run

TODO: Add a run and/or build script

Build the client:

```shell
cd client
npm install
npm run build
```

Next, move the built bin to the [server](/server/) directory.

Next, run the web server:
 
```shell
cd server
npm install
npm start
```

Next, run the API (backend):

```shell
cd BackEnd
npm install
npm start
```

## BackEnd Arcitecture

### Folder structure

BackEnd
 ┗ src
 ┃ ┣ features
 ┃ ┃ ┣ authentication
 ┃ ┃ ┣ entries
 ┃ ┃ ┗ users
 ┃ ┗ middleware

## Workflow
See [WORKFLOW.md](WORKFLOW.md). 

## Tests
See [tests/README.md](tests/README.md). 
