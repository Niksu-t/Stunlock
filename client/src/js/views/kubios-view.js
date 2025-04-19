import { Careteam } from "./careteam-view";
import { Summary } from "./summary-view";

export const Kubios = {
    Render(state) {
        const div = document.createElement('div');
        div.classList = "flex-col flex gap-8"

        div.innerHTML = `
            <div>
                <h1>Vaihe 3/3: Kubios</h1>
                <h1 class="text-2xl">Luo tili</h1>
            </div>
            <p>Voit asettaa Kubios käyttäjän myös myöhemmin.</p>
            <div class="flex flex-col gap-8">
                <div>
                    <label for="email">Kubios sähköposti.</label><br>
                    <input class="inset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2" type="text" id="email" name="email" value="John">
                </div>
                <div>
                    <label for="password">Kubios salasana.</label><br>
                    <input class="inset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2" type="password" id="password" name="password" value="Doe">
                </div>
            </div>
            <div class="flex flex-row gap-2">
                <button id="nav-careteam" class="bg-brand-red text-white rounded-4xl p-2 px-4 shadow-offset-4 cursor-pointer">Takaisin.</button>
                <button id="nav-summary" class="bg-brand-red text-white rounded-4xl p-2 px-4 shadow-offset-4 cursor-pointer">Jatka.</button>
            </div>
            <button id="skip" class="cursor-pointer text-end text-gray-500">Ohita.</button>
            
        `;

        return div;
    },

    AfterRender() {
        // Setup navigation buttons
        const nav_careteam = document.getElementById('nav-careteam');
        const nav_summary = document.getElementById('nav-summary');
        const skip = document.getElementById('skip');

        nav_careteam.addEventListener("click", (e) => {
            renderPage(e, Careteam)
        });

        nav_summary.addEventListener("click", (e) => {
            renderPage(e, Summary)
        });

        skip.addEventListener("click", (e) => {
            renderPage(e, Summary)
        });
    },

    OnPageChange(state) {
        state.kubios_email = document.getElementById("email").value.trim();
        state.kubios_password = document.getElementById("password").value.trim();
    }
};