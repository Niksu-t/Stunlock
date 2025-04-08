export default function Register() {
    const div = document.createElement('div');
    div.classList = "flex-col flex gap-16"

    div.innerHTML = `
        <h1 class="text-2xl">Luo tili</h1>
        <form id="register-form" class="flex flex-col gap-8">
            <div>
                <label for="fname">Etunimi.</label><br>
                <input class="inset-shadow-2xs bg-gray-100 rounded p-2 w-full mt-2" type="text" id="fname" name="fname" value="John">
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
            <button onclick="renderPage(event, 'careteam')" class="bg-brand-red text-white rounded-4xl p-2 px-4 shadow-offset-4">Luo tili</button>
        </form>

        <div class="text-center">
            <p>Onko jo käyttäjä? <a href="/login" class="text-brand-red underline">Kirjaudu</a>.</p>
        </div>
    `;
    return div;
  }