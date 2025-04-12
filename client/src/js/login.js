import { postLoginUser } from "./fetch-api";

async function loginUser(event) {
    event.preventDefault();

    const response = await postLoginUser(
        document.getElementById("email").value.trim(),
        document.getElementById("password").value.trim(),
        document.getElementById("remember").checked
    );

    if(response) {
        window.location.href = "/dashboard";
    }
}

const form = document.getElementById("login-form");
form.addEventListener("submit", loginUser);