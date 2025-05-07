*** Settings ***
Library         Browser    auto_closing_level=KEEP
Library         Collections
Variables       load_env.py


*** Test Cases ***
Successfull Login
    New Browser    chromium    headless=No
    New Page    ${BASE_URL}/login
    Type Text    [id="email"]    ${EMAIL}    delay=0.1 s
    Type Secret    [id="password"]    $PASSWORD    delay=0.1 s
    Click With Options    [id="login-submit"]    delay=2 s

    Wait For Navigation    ${BASE_URL}/dashboard    timeout=10 s
    Log    Login successful, test passed.

New Diary Entry
    New Browser    chromium    headless=No
    New Page    ${BASE_URL}/dashboard

    Wait For Elements State    id=${ISO_TODAY}    visible

    Click   id=${ISO_TODAY}

    Evaluate JavaScript     [id="stress"]
    ...     (element) => {
    ...         element.value = 5
    ...         element.dispatchEvent(new Event('input'))
    ...     }

    Evaluate JavaScript     [id="pain"]
    ...     (element) => {
    ...         element.value = 6
    ...         element.dispatchEvent(new Event('input'))
    ...     }

    Click With Options    id=save-diary     delay=2 s


Modify Diary Entry
    New Browser    chromium    headless=No
    New Page    ${BASE_URL}/dashboard

    Wait For Elements State    id=${ISO_TODAY}    visible

    Click   id=${ISO_TODAY}

    Evaluate JavaScript     [id="stress"]
    ...     (element) => {
    ...         element.value = 2
    ...         element.dispatchEvent(new Event('input'))
    ...     }

    Evaluate JavaScript     [id="pain"]
    ...     (element) => {
    ...         element.value = 3
    ...         element.dispatchEvent(new Event('input'))
    ...     }

    Click With Options    id=save-diary     delay=2 s
