# Stunlock API
The Stunlock API handles all interaction with outside services and the database. The API handles all business logic and data.

## How to run
See root [root README.md](../README.md) for instructions.

## .env file
Running the API requires a .env file.

- DB_HOST
- DB_USER
- DB_NAME
- DB_PASSWORD
- JWT_SECRET

- CLIENT_ID
- AUTH_URL
- TOKEN_URL
- REDIRECT_URI
- KUBIOS_USER_AGENT
- KUBIOS_API_URI

## Apidoc 
Build apidoc with

```shell
npm run apidoc
```
