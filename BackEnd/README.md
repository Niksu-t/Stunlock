# Stunlock API
The Stunlock API handles all interaction with outside services and the database. The API handles all business logic and data.

## How to run
See [root README.md](../README.md) for instructions.

## .env file
Running the API requires a .env file with the following contents:

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

## Database
Stunlock uses a relational database with 3 tables: Users, CareGroup and diary_entries. The diary_entries pain_points field is a bitmask, where each position represents a true or false pain point.

![Database ER model](/images/database.png)

## Apidoc 
Build apidoc with:

```shell
npm run apidoc
```
