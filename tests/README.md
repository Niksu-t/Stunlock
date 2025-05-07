# Tests

Tests are ran automatically by the CI/CD pipeline (not implemented). Tests are user acceptance and unit tests made with the Robot framework. 

[Sample test report.](https://niksu-t.github.io/Stunlock/assets/sample-tests/test-1/report.html)

# How to run

Ideally, create a Python virtual enviornment (venv)

```shell
py -m venv .venv
```

Activate virtual enviornment and install dependencies:

```shell
pip install -r requirements.txt
rfbrowser init
```

Run tests:

```shell
py scripts/run-tests.py
```

Optionally, use the ```-d``` option to set an output directory.

## .env file

Some tests require the use of a .env file with the following contents:

- FNAME
- LNAME
- PASSWORD
- BASE_URL
- KUBIOS_EMAIL
- KUBIOS_PASSWORD
- API_BASE_URL

# User interface (UI) tests

## register-login.robot

### Register with Kubios and Careteam

Test registers new user with Kubios user and Careteam

1. Agent fills in related fields and presses "Jatka."
2. Agent chooses Kuopion Yliopistollinen sairaala as care team and presses "Jatka."
3. Agent links Kubios-account and presses "Luo käyttäjä."
4. Agent waits to be redirected to user dashboard

### Register with duplicate email

1. Agent fills in related fields and presses "Jatka.".
2. Agent skips careteam and Kubios
4. Agent attempts to register account and checks for error message 

### Login

1. Agent fills in related fields and logs in
2. Agent waits to be redirected to user dashboard

### Login

Test logs in

## diary.robot

### Create diary entry for today

### Modify old entry

### Modify old entry with invalid fields


# Unit tests (direct API calls)

## unit-register-login.robot

### Register user with Kubios user

1. Agent creates user with related fields
2. Agent confirms response status code

### Login 

1. Agent logs in with created users email and password
2. Agent confirms response status code
