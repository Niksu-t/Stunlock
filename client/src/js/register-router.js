import Register from "./views/register-view";
import Careteam from "./views/careteam-view";


export function renderPage(path) {
    console.log("test")
    const app = document.getElementById('app');
    app.innerHTML = '';  // Clear previous content

    if (path === 'register') {
        app.appendChild(Register());
    } else if (path === 'careteam') {
        app.appendChild(Careteam());
    } else {
        app.appendChild(Home());
    }
}