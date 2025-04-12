import { Register } from "./views/register-view.js";
import { Careteam } from "./views/careteam-view.js";


export function renderPage(path, state) {
    // Save current page register state
    if(state.currentPage) {
        state.currentPage.OnPageChange(state);
    }

    const app = document.getElementById('app');
    app.innerHTML = '';  // Clear previous content

    app.appendChild(path.Render(state));
    path.AfterRender();
    state.currentPage = path;
}