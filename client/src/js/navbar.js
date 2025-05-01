import { getLogout } from "./fetch-api"

function init() {
    console.log("testing")

    const fname = localStorage.getItem("user_fname")

    const headerRight = document.getElementById("header-right")

    headerRight.innerHTML = `
        <div class="flex flex-row items-center bg-brand-red text-white rounded-4xl p-1 px-6 shadow-offset-4 min-w-44" id="user-menu">
            <p class="font-semibold cursor-pointer inline-block">${fname}</p>
            <img src="arrow-white.svg" class="w-8 cursor-pointer inline-block rotate-270 fill-white ml-auto"/>
        </div>
        <div
            id="dropdownMenu"
            class="origin-top-right absolute z-50 right-10 mt-14 w-44 rounded-2xl h-0 transition-all duration-200 text-white transform overflow-hidden bg-brand-red shadow-offset-4"
        >
            <div class="py-1 p-2">
                <a href="/dashboard" class="block px-4 py-2">Työpöytä</a>
                <a href="/statistics" class="block px-4 py-2">Tilastot</a>
                <a href="/settings" class="block px-4 py-2">Asetukset</a>
                <div id="logout" class="bg-white rounded-4xl px-4 py-2 w-full mt-6 text-center text-brand-dark cursor-pointer">Kirjaudu ulos</div>
            </div>
        </div>
    `;

    document.getElementById("logout").addEventListener("click", logout)
    document.getElementById("user-menu").addEventListener("click", toggleUserMenu);    
}

async function logout() {
    const response = await getLogout();

    localStorage.clear();
    window.location.href = "/login";
}

let menuToggle = false;

async function toggleUserMenu() {
    const dropdown = document.getElementById('dropdownMenu');

    menuToggle = !menuToggle;
    
    requestAnimationFrame(() => {
        if(menuToggle) {
            dropdown.classList.add("h-50")
        }
        else {
            dropdown.classList.remove("h-50")
        }
    });
    
}

addEventListener("userdata", init);