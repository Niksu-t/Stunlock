import { tryRenderPage } from "../register";
import { Careteam } from "./careteam-view";
import { Summary } from "./summary-view";
import { renderPage } from "../register-router";
import { postValidateKubios } from "../fetch-api";
import { set_error, reset_error } from "../register";

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
                    <input class="inset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2 border-transparent border-4 border-solid" type="text" id="email" name="email" value="${state.kubios_email}">

                </div>
                <div>
                    <label for="password">Kubios salasana.</label><br>
                    <input class="inset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2 border-transparent border-4 border-solid" type="password" id="password" name="password" value="${state.kubios_password}">
                </div>
                <p class="text-brand-red invisible h-5" id="error">-</p>

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
            renderPage(Careteam)
        });

        nav_summary.addEventListener("click", (e) => {
            tryRenderPage(Summary, this, postValidateKubios)
        });

        skip.addEventListener("click", (e) => {
            renderPage(Summary)
        });
    },

    ValidateInput(state) {
        return true
    },

    ServerSideValidation(errors) {
        const error_message = document.getElementById("error");
        error_message.classList.remove("invisible")

        set_error("email")
        set_error("password")

        error_message.innerHTML = "Kubios tilin kirjautuminen epäonnistui."
    },

    SaveState(state) {
        state.kubios_email = document.getElementById("email").value.trim();
        state.kubios_password = document.getElementById("password").value.trim();
    },

    OnPageChange(state) {

    }
};