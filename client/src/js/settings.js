import { postLoginKubios } from "./fetch-api";
import { HandleResponseKubios, KubiosIsLoggedIn, KubiosTokenExpired } from "./utils";

let open = false

function onPageLoad() {
    const user = JSON.parse(localStorage.getItem("user"));

    document.getElementById("fname").innerHTML = user.fname;
    document.getElementById("lname").innerHTML = user.lname;
    document.getElementById("email").innerHTML = user.email;

    if(KubiosIsLoggedIn()) {
        document.getElementById("kubios-widget").classList.remove("hidden");
    }

    if(KubiosTokenExpired()) {
        document.getElementById("kubios-relog").classList.remove("hidden");
    }
}

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
    )

    HandleResponseKubios(response);
}

document.getElementById("login-again").addEventListener("click", toggleLoginFields);
document.getElementById("kubios-login-form").addEventListener("submit", loginKubios);
addEventListener("userdata", onPageLoad)