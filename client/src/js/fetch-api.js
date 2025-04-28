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

export async function getMe() {
    const response = await fetch("api/auth/me")
    .then((response) => {
        if(response.ok) {
            return response.json();
        }
    })
    
    return response;
}

export async function getDiary() {
    const response = await fetch("api/entries/")
    .then((response) => {
        if(response.ok) {
            return response.json();
        }
    })
    
    return response;
}

export async function postDiary(stress, pain, stiffness, sleep, notes, entry_date) {
    const response = await fetch("api/entries/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            stress,
            pain,
            stiffness,
            sleep,
            notes,
            entry_date
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

export async function updateDiary(id, stress, pain, stiffness, sleep, notes) {
    const response = await fetch(`api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            stress,
            pain,
            stiffness,
            sleep,
            notes
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

export async function getAllKubiosResults(token) {
    let headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }

    const options = {
        method: 'GET',
        headers: headers,
        credentials: "include",
    }

    const data = await fetch(`api/kubios/`, options)
        .then((response) => {
            if(!response.ok) {
                throw new Error("Connection error")
            }
            return response.json();
        })

    console.log(data)

    return data;
}

export async function postLoginKubios(password) {
    const response = await fetch("api/kubios/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            password
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