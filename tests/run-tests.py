from robot import run

tests = ["register-login.robot", "unit-register-login.robot", "diary-entry.robot", "unit-diary-entry.robot"]

options = {
    'outputdir': 'bin'
}

run(*tests, **options)