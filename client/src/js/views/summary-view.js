import { Kubios } from "./kubios-view";

export const Summary = {
    Render() {
        const div = document.createElement('div');
        div.classList = "flex-col flex gap-8"

        div.innerHTML = `
            <div>
                <h1 class="text-2xl">Luo tili</h1>
            </div>
            <p>Tarkista valintasi ja luo tili.</p>
            <form id="register-form" class="flex flex-col gap-8">
                <div class="flex flex-row gap-2">
                    <button id="nav-link-api" class="bg-brand-red text-white rounded-4xl p-2 px-4 shadow-offset-4 cursor-pointer">Takaisin.</button>
                    <button id="register" class="bg-brand-red text-white rounded-4xl p-2 px-4 shadow-offset-4 cursor-pointer">Luo käyttäjä.</button>
                </div>
            </form>
            
        `;

        return div;
    },

    AfterRender() {
        // Setup navigation buttons
        const nav_link_api = document.getElementById('nav-link-api');

        nav_link_api.addEventListener("click", (e) => {
            renderPage(e, Kubios)
        });

        const register = document.getElementById('register');

        register.addEventListener("click", (e) => {

        });
    },

    OnPageChange() {

    }
};