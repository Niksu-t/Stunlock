export default function Careteam() {
    const div = document.createElement('div');
    div.classList = "flex-col flex gap-16"

    div.innerHTML = `
        <h1 class="text-2xl">Aseta hoitotiimi.</h1>
    `;
    return div;
  }