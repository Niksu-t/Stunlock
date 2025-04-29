*** Settings ***
Library    Collections 
Library    RequestsLibrary
Variables       load_env.py


Suite Setup    Create Session    Stunlock    ${API_BASE_URL}

*** Test Cases ***
Create New User
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    
    ...     fname=${FNAME}     
    ...     lname=${lname}    
    ...     email=${EMAIL}    
    ...     password=${PASSWORD}    
    ...     kubios_email=${KUBIOS_EMAIL}    

    ${response}=    POST On Session    Stunlock    /users/    json=${body}    headers=${headers}
    Should Be Equal As Integers    ${response.status_code}    201
    Log    ${response.json()}

Login As User 
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${body}=    Create Dictionary    
    ...     email=${EMAIL}    
    ...     password=${PASSWORD}    

    ${response}=    POST On Session    Stunlock    /auth/login    json=${body}    headers=${headers}
    Should Be Equal As Integers    ${response.status_code}    200
    Log    ${response.json()}
