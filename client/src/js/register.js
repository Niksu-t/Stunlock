import { renderPage } from './register-router';
import { postRegisterUser } from './fetch-api';
import { Register } from './views/register-view';

let state = {
    currentPage: null,
    fname: "",
    lname: "",
    email: "",
    password: "",
    kubios_email: "",
    kubios_password: ""
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

renderPage(Register, state);



// SPA router things

// Listen to browser navigation events
window.addEventListener('popstate', () => {
    renderPage(window.location.pathname);
  });
  
// Handle client-side navigation
window.renderPage = function(event, page) {
event.preventDefault();
renderPage(page, state);
};


