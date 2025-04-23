*** Settings ***
Library         Browser    auto_closing_level=KEEP
Library         Collections
Variables       load_env.py


*** Test Cases ***
Test Web Form
    New Browser    chromium    headless=No
    New Page    ${BASE_URL}/register
    Type Text    [id="fname"]    ${FNAME}    delay=0.1 s
    Type Text    [id="lname"]    ${LNAME}    delay=0.1 s
    Type Text    [id="email"]    ${EMAIL}    delay=0.1 s

    Type Secret    [id="password"]    $PASSWORD    delay=0.1 s
    Click With Options    button    delay=2 s

    Type Text    [id="careteam"]    Apple    delay=0.1 s
    Click With Options    [id="nav-link-api"]    delay=2 s

    Type Text    [id="email"]    ${KUBIOS_EMAIL}    delay=0.1 s
    Type Secret    [id="password"]    $KUBIOS_PASSWORD    delay=0.1 s

    Click With Options    [id="nav-summary"]    delay=2 s

    Click With Options    [id="register"]    delay=2 s


    Wait For Navigation    ${BASE_URL}/dashboard    timeout=10 s
    Log    Registration successful, test passed.
