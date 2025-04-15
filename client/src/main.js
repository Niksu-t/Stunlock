import { postLoginUser, postRegisterUser, getMe } from './js/fetch-api'
import './style.css'

// TODO: Move to register and login page.
//postRegisterUser("lars", "thurin", "pledplers5@gmail.com", "24172704")

async function onPageLoad(e) {
    const user = await getMe();

    if(user) {
        console.log(user);
    }
}

addEventListener("load", onPageLoad);