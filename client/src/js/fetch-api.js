/**
 * Sends a POST request to the backend to create a new user.
 * @returns The request response
 */
export async function postRegisterUser(fname, lname, email, password, kubios_email, kubios_password) {
    console.log(fname, lname, email, password);
    const response = await fetch("api/users/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fname,
            lname,
            email,
            password,
            kubios_email,
            kubios_password
        })
    })
    .then((response) => {
        if(!response.ok) {
            throw new Error("Connection error")
        }
        return response.json();
    })

    return response;
}

export async function postLoginUser(email, password, remember_me) {
    const response = await fetch("api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password,
            remember_me
        })
    })
    .then((response) => {
        if(!response.ok) {
            throw new Error("Connection error")
        }
        return response.json();
    })
    
    return response;
}