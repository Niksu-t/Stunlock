import { renderPage } from './register-router';
import { postRegisterUser } from './fetch-api';
import { Register } from './views/register-view';

let state = {
    currentPage: null,
    fname: "",
    lname: "",
    email: "",
    password: "",
}

/**
 * Handles form input and sends POST request to server.
 */
async function loginUser(event) {
    event.preventDefault();

    const response = await postRegisterUser(
        document.getElementById("fname").value.trim(),
        document.getElementById("lname").value.trim(),
        document.getElementById("email").value.trim(),
        document.getElementById("password").value.trim()
    )

    
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


