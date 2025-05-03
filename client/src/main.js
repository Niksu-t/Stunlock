import './style.css'

import { getMe } from './js/fetch-api'

export async function init() {

    const response = await getMe();

    if(response.user) {
        localStorage.setItem("user", JSON.stringify({
            fname: response.user.fname,
            lname: response.user.lname,
            email: response.user.email
        }));
    }

    const event = new CustomEvent('userdata');
    window.dispatchEvent(event);
}

init();