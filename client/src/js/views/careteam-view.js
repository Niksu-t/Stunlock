import { Register } from "./register-view";

export const Careteam = {
    Render() {
        const div = document.createElement('div');
        div.classList = "flex-col flex gap-8"

        div.innerHTML = `
            <div>
                <h1>Vaihe 2/3: Hoitotiimi</h1>
                <h1 class="text-2xl">Luo tili</h1>
            </div>
            <p>Voit asettaa hoitotiimin myös myöhemmin.</p>
            <form id="register-form" class="flex flex-col gap-8">
                <div class="relative w-64">
                    <label for="dropdown">Hoitotiimi.</label><br>

                    <input type="text" id="dropdownInput" placeholder="Hae..." class="insset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2" />
                    <div id="dropdownList" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto hidden"></div>
                </div>
                <div class="flex flex-row gap-2">
                    <button id="nav-register" class="bg-brand-red text-white rounded-4xl p-2 px-4 shadow-offset-4 cursor-pointer">Takaisin.</button>
                    <button id="nav-link-api" class="bg-brand-red text-white rounded-4xl p-2 px-4 shadow-offset-4 cursor-pointer">Jatka.</button>
                </div>
            </form>
            <button class="cursor-pointer text-end text-gray-500">Ohita.</button>
            
        `;

        return div;
    },

    AfterRender() {
        // Setup navigation buttons
        const nav_register = document.getElementById('nav-register');
        const nav_link_api = document.getElementById('nav-link-api');

        nav_register.addEventListener("click", (e) => {
            renderPage(e, Register)
        });
        nav_link_api.addEventListener("click", (e) => {
            renderPage(e, LinkApi)
        });



        const input = document.getElementById('dropdownInput');
        const dropdown = document.getElementById('dropdownList');

        const items = ["Apple", "Banana", "Cherry"]

        dropdown.innerHTML = '';
        items.forEach(item => {
          const option = document.createElement('div');
          option.textContent = item;
          option.className = "px-4 py-2 hover:bg-gray-100 cursor-pointer";
          dropdown.appendChild(option);
        });
    
        input.addEventListener('focus', () => {
        dropdown.classList.remove('hidden');
        });
    
        input.addEventListener('input', () => {
        const filter = input.value.toLowerCase();
        const items = dropdown.querySelectorAll('div');
        items.forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(filter) ? '' : 'none';
        });
        });
    
        dropdown.addEventListener('click', e => {
        if (e.target.tagName === 'DIV') {
            input.value = e.target.textContent;
            dropdown.classList.add('hidden');
        }
        });
    
        document.addEventListener('click', e => {
        if (!e.target.closest('.relative')) {
            dropdown.classList.add('hidden');
        }
        });
    },

    OnPageChange() {

    }
};