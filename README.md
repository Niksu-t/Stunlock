# Stunlock

Stunlock is a proprietary (perhaps source-available upon release) web application developed in part of a university course.

Stunlock is a web application consisting of a [client](/client/) built with Vite.js, and a [backend](/BackEnd/) built with Express.js. The backend handles all heavier loads, user information, data, business logic etc. The application is hosted on a Ubuntu virtual machine with Apache2 serving as a reverse proxy.  
 
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
