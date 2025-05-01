import './style.css'

import { getMe } from './js/fetch-api'

export async function init() {

    const response = await getMe();

    if(response.user) {
        localStorage.setItem("user_fname", response.user.fname);
    }

    const event = new CustomEvent('userdata');
    window.dispatchEvent(event);
}

init();