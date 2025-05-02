import { postLoginUser } from "./fetch-api";
import { loop_required_fields, set_error } from "./utils";

async function loginUser(event) {
    event.preventDefault();

    const payload = {
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim()
    };

    const keys = ["email", "password"];
    if(loop_required_fields(keys, payload, "Pakollinen kenttä!")) {
        return false;
    }

    const response = await postLoginUser(
        payload.email,
        payload.password,
        document.getElementById("remember").checked,
        true
    );

    console.log(response)

    if(response.status == 200) {
        localStorage.setItem("kubios_token", response.kubios_token)
        window.location.href = "/dashboard";
    }
    else {
        switch(response.message) {
            case "Incorrect password":
                set_error("password", "Väärä salasana!");
                break;

            case "User not found":
                set_error("email", "Käyttäjää ei löydetty!");
                break;
        }
    }
}

const form = document.getElementById("login-form");
form.addEventListener("submit", loginUser);