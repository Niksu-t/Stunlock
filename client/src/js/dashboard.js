let open = false;

function toggleDiary() {
    const panel = document.getElementById("diary-entry");
    open = !open;

    if(open) {
        panel.classList.add("w-92")
        panel.classList.add("h-92")
    }
    else {
        panel.classList.remove("w-92")
        panel.classList.remove("h-92")

    }
}

document.getElementById("diary-button").addEventListener("click", toggleDiary);