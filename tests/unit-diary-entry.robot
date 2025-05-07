*** Settings ***
Library    Collections 
Library    RequestsLibrary
Variables       load_env.py


Suite Setup    Create Session    Stunlock    ${API_BASE_URL}

*** Variables ***
${ses_cookie}

*** Test Cases ***
Login As User 
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    
    ...     email=${EMAIL}    
    ...     password=${PASSWORD}    

    ${response}=    POST On Session    Stunlock    /auth/login    json=${body}    headers=${headers}
    Should Be Equal As Integers    ${response.status_code}    200

    ${cookie}     Get From Dictionary    ${response.cookies}    auth_token
    Set Suite Variable    ${ses_cookie}   ${cookie}

    Log    ${response.json()}

New Entry
    ${headers}=    Create Dictionary    Content-Type=application/json   Cookie=auth_token=${ses_cookie}
    ${body}=    Create Dictionary   
    ...     entry_date=${ISO_YESTERDAY}
    ...     pain_points={}
    ...     stress=4     
    ...     pain=3    
    ...     stiffness=2    
    ...     sleep=1    
    ...     notes=Robot    

    ${response}=    POST On Session    Stunlock    /entries/    
    ...     json=${body}    
    ...     headers=${headers}

    
    Should Be Equal As Integers    ${response.status_code}    200
    Log    ${response.json()}

Duplicate Entry
    ${headers}=    Create Dictionary    Content-Type=application/json   Cookie=auth_token=${ses_cookie}
    ${body}=    Create Dictionary   
    ...     entry_date=${ISO_YESTERDAY}
    ...     pain_points={}
    ...     stress=4     
    ...     pain=3    
    ...     stiffness=2    
    ...     sleep=1    
    ...     notes=Robot    

    ${response}=
    ...     POST On Session    Stunlock    /entries/    
    ...     json=${body}    
    ...     headers=${headers}
    ...     expected_status=400

    Log     ${response}
    
    Should Be Equal As Integers    ${response.status_code}    400
    Log    ${response.json()}
