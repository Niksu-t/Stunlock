import { Careteam } from "./careteam-view";

export const Register = {
    Render() {
        const div = document.createElement('div');
        div.classList = "flex-col flex gap-16"
    
        div.innerHTML = `
            <div>
                <h1>Vaihe 1/3: Tilini</h1>
                <h1 class="text-2xl">Luo tili</h1>
            </div>
            <form id="register-form" class="flex flex-col gap-8">
                <div>
                    <label for="fname">Etunimi.</label><br>
                    <input class="insset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2" type="text" id="fname" name="fname" value="John">
                </div>
                <div>
                    <label for="lname">Sukunimi.</label><br>
                    <input class="inset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2" type="text" id="lname" name="lname" value="John">
                </div>
                <div>
                    <label for="email">Sähköposti.</label><br>
                    <input class="inset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2" type="text" id="email" name="email" value="John">
                </div>
                <div>
                    <label for="password">Salasana.</label><br>
                    <input class="inset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2" type="password" id="password" name="password" value="Doe">
                </div>
                <button id="nav-button" class="bg-brand-red text-white rounded-4xl p-2 px-4 shadow-offset-4 cursor-pointer">Jatka</button>
            </form>
    
            <div class="text-center">
                <p>Onko jo käyttäjä? <a href="/login" class="text-brand-red underline">Kirjaudu</a>.</p>
            </div>
        `;
        return div;
    },

    AfterRender() {
        const nav_button = document.getElementById("nav-button");
        nav_button.addEventListener("click", (e) => {
            renderPage(e, Careteam)
        })
    },

    OnPageChange(state) {
        state.fname = document.getElementById("fname").value.trim();
        state.lname = document.getElementById("lname").value.trim();
        state.email = document.getElementById("email").value.trim();
        state.password = document.getElementById("password").value.trim();
        
        console.log(state);
    }
}