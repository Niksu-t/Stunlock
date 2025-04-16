import { postDiary, getDiary, updateDiary } from "./fetch-api";
import dayjs from 'dayjs';

let open = false;

function toggleDiary() {
    const panel = document.getElementById("diary-entry");
    open = !open;

    requestAnimationFrame(() => {
        if(open) {
            panel.classList.add("w-92")
            panel.classList.add("h-92")
        }
        else {
            panel.classList.remove("w-92")
            panel.classList.remove("h-92")
        }
    });
}

async function postOrUpdateEntry(e) {
    let id;
    const stress = 10;
    const pain = 5;
    const stiffness = 5;
    const sleep = 5;
    const notes = "some other notes";

    // e.preventDefault();
    const today = new Date('2025-12-26').toISOString().slice(0, 10);

    const entries = await getDiary();

    for(const entry of entries) {
        const rawDate = entry.entry_date;
        const formatted = dayjs(rawDate).format('YYYY-MM-DD');

        if(formatted == today) {
            id = entry.entry_id;
            console.log("already found");
            break;
        }
    }

    let result;
    if(id) {
        result = await updateDiary(
            id,
            stress,
            pain,
            stiffness,
            sleep,
            notes,
        )
    }
    else {
        result = await postDiary(
            stress,
            pain,
            stiffness,
            sleep,
            notes,
            today
        )
    }

    
}

// TODO: Add entry widget
//document.getElementById("submit-diary").addEventListener("click", postOrUpdateEntry);

document.getElementById("diary-toggle").addEventListener("click", toggleDiary);