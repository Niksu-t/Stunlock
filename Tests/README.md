# User Tests

Tests are ran automatically by the CI/CD pipeline. Tests are user acceptance tests built with the Robot framework.

# How to run

TODO: venv, requirements etc

## Register and Login

Test registers new user and logs in as said user.

1. Agent clicks on "Liity nyt."
2. Agent fills in related fields and presses "Jatka.".
3. Agent chooses Kuopion Yliopistollinen sairaala as care team and presses "Jatka.".
4. Agent links Kubios-account and presses "Luo käyttäjä.".
5. Agent waits to be redirected to user dashboard.

### Diary entry

Test logs user into the web application and creates a diary entry.

1. Agent clicks on "Kirjaudu.".
2. Agent fills in related fields and presses "Kirjaudu.".
3. Agent waits to be redirected to the user dashboard.
4. Agent presses "Täytä päiväkirja." and fills in related fields: Pain on ankles and wrists, moderate gauges and "pain" as notes.
5. Agent presses "Tallenna.".
6. Agent navigates to "Tilastot" -page and confirms creation of diary entry.


### Sending report

Logs in and sends report forward

#### Send message

Logs in and sends message forward

# Admin Tests

## Login

Log in as created admin

# Healthcare Professional Tests

## Login 

Log in as already created user

### Check care requests

Log in and check care requests. Check list and open the first request from the list.
Send message to the requester. Close request.