import { postLoginKubios } from "./fetch-api";

let open = false

function toggleLoginFields() {
    const panel = document.getElementById("kubios-login");

    open = !open;

    requestAnimationFrame(() => {
        if(open) {
            panel.classList.add("h-40")
        }
        else {
            panel.classList.remove("h-40")
        }
    });
}

async function loginKubios(e) {
    e.preventDefault();

    const response = await postLoginKubios(
        document.getElementById("password").value.trim(),
    );

    if(response.token) {
        localStorage.setItem("kubios_token", response.token);
    }
    
}

document.getElementById("login-again").addEventListener("click", toggleLoginFields);
document.getElementById("kubios-login-form").addEventListener("submit", loginKubios);