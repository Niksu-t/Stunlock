import { renderPage } from './register-router.js';
import { postRegisterUser, postValidateRegister } from './fetch-api.js';
import { Register } from './views/register-view.js';

export const state = {
    currentPage: null,
    fname: "",
    lname: "",
    email: "",
    password: "",
    kubios_email: "",
    kubios_password: ""
}

export function reset_error(key) {
    const error_message = document.getElementById(`${key}-error`);
    error_message.classList.add("invisible")

    const widget = document.getElementById(key);
    widget.classList.remove("border-brand-red");
    widget.classList.add("border-transparent");
}

export function set_error(key, error) {
    if(error) {
        const error_message = document.getElementById(`${key}-error`);
        error_message.classList.remove("invisible")
        error_message.innerHTML = error
    }

    const widget = document.getElementById(key);
    widget.classList.add("border-brand-red")
    widget.classList.remove("border-transparent");
}

/**
 * Handles form input and sends POST request to server.
 */
export async function registerUser(event) {
    event.preventDefault();

    const response = await postRegisterUser(
        state.fname,
        state.lname,
        state.email,
        state.password,
        state.kubios_email,
        state.kubios_password
    )

    if(response.kubios_token) {
        localStorage.setItem("kubios_token", response.kubios_token);
    }

    if(response) {
        window.location.href = "/dashboard";
    }
}

export async function tryRenderPage(next_page, current_page, validateCallback) {
    current_page.SaveState(state);

    if(!current_page.ValidateInput(state)) {
        return false
    }

    const response = await validateCallback(state)

    if(response.ok) {
        renderPage(next_page);
    }
    else {
        const json = await response.json();
        current_page.ServerSideValidation(json.errors);
    }
}

renderPage(Register, state);
