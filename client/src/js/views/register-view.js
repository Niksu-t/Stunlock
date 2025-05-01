import { tryRenderPage } from "../register";
import { Careteam } from "./careteam-view";
import { set_error, reset_error } from "../register";
import { postValidateRegister } from "../fetch-api";

export const Register = {
    Render(state) {
        const div = document.createElement('div');
        div.classList = "flex-col flex gap-8"
    
        div.innerHTML = `
            <div>
                <h1>Vaihe 1/3: Tilini</h1>
                <h1 class="text-2xl">Luo tili</h1>
            </div>
            <div class="flex flex-col gap-2">
                <div>
                    <label for="fname">Etunimi.</label><br>
                    <input class="insset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2 border-transparent border-4 border-solid" type="text" id="fname" name="fname" value="${state.fname}">
                    <p class="text-brand-red invisible h-5" id="fname-error">-</p>
                </div>
                <div>
                    <label for="lname">Sukunimi.</label><br>
                    <input class="inset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2 border-transparent border-4 border-solid" type="text" id="lname" name="lname" value="${state.lname}">
                    <p class="text-brand-red invisible h-5" id="lname-error">-</p>
                </div>
                <div>
                    <label for="email">Sähköposti.</label><br>
                    <input class="inset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2 border-transparent border-4 border-solid" type="text" id="email" name="email" value="${state.email}">
                    <p class="text-brand-red invisible h-5" id="email-error">-</p>
                </div>
                <div>
                    <label for="password">Salasana.</label><br>
                    <input class="inset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2 border-transparent border-4 border-solid" type="password" id="password" name="password" value="${state.password}">
                    <p class="text-brand-red invisible h-5" id="password-error">-</p>
                </div>
            </div>
            <div class="flex flex-row gap-2">
                <button id="nav-button" class="bg-brand-red text-white rounded-4xl p-2 px-4 shadow-offset-4 cursor-pointer">Jatka</button>
            </div>
            <p id="error"></p>
    
            <div class="text-center">
                <p>Onko jo käyttäjä? <a href="/login" class="text-brand-red underline">Kirjaudu</a>.</p>
            </div>
        `;
        return div;
    },

    AfterRender() {
        const nav_button = document.getElementById("nav-button");
        nav_button.addEventListener("click", async (e) => {
            const validation_result = await tryRenderPage(Careteam, this, postValidateRegister);
        })
    },

    ValidateInput(state) {
        let error_found = false

        const keys = ["fname", "lname", "email", "password"]

        // Add error messages to each field (only empty error messages)
        keys.forEach(key => {
            reset_error(key);

            if(state[key].length == 0) {
                error_found = true;
                set_error(key, "Pakollinen kenttä!")
            }
        }); 

        return !error_found;
    },

    ServerSideValidation(errors) {
        errors.forEach(error => {
            set_error(error.field, error.message);
        }); 

    },

    SaveState(state) {
        state.fname = document.getElementById("fname").value.trim();
        state.lname = document.getElementById("lname").value.trim();
        state.email = document.getElementById("email").value.trim();
        state.password = document.getElementById("password").value.trim(); 
    },

    OnPageChange(state) {}
}