/**
 * Sends a POST request to the backend to create a new user.
 * @returns The request response
 */
export async function postRegisterUser(fname, lname, email, password, kubios_email, kubios_password) {
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
        return response.json();
    })

    return response;
}

export async function postValidateRegister(state) {
    const response = await fetch("api/users/validate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fname: state.fname,
            lname: state.lname,
            email: state.email,
            password: state.password,
        })
    })
    .then((response) => {
        return response;
    })

    return response;
}

export async function getLogout() {
    const response = await fetch("api/auth/logout")
    .then((response) => {
        return response;
    })

    return response;
}

export async function postValidateKubios(state) {
    const response = await fetch("api/kubios/validate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            kubios_email: state.kubios_email,
            kubios_password: state.kubios_password,
        })
    })
    .then((response) => {
        return response;
    })

    return response;
}

export async function postLoginUser(email, password, remember_me, json = false) {
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
        if(json) {
            return response.json();
        }
        return response;
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

export async function postDiary(pain_points, stress, pain, stiffness, sleep, notes, entry_date) {
    const response = await fetch("api/entries/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            pain_points,
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

export async function updateDiary(id, pain_points, stress, pain, stiffness, sleep, notes) {
    const response = await fetch(`api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            pain_points,
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
            return response.json();
        })

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