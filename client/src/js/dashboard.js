import { getWeekDays } from './utils';
import { generateThisWeekGraph } from './graphs';
import { postDiary, getDiary, updateDiary, getAllKubiosResults } from "./fetch-api";

let state = {
    average_percentage: 0,
    average_rmssd: 0,
}

let current_diary = {
    id: null,
}

let open = false;

function openImportDiaryEntry(data) {
    current_diary.id = null

    if(data.id) {
        current_diary.id = data.id
    }

    document.getElementById("date-picker").value = data.date
    document.getElementById("stress").value = data.stress
    document.getElementById("pain").value = data.pain
    document.getElementById("stiffness").value = data.stiffness
    document.getElementById("sleep").value = data.sleep
    document.getElementById("notes").value = data.notes

    if(!open) {
        toggleDiary();
    }
}

async function toggleDiary() {
    const panel = document.getElementById("diary-entry");
    open = !open;

    requestAnimationFrame(() => {
        if(open) {
            document.getElementById('diary-modal').classList.remove('hidden')
            panel.classList.add("xl:w-xl")
            panel.classList.add("xl:h-[970px]")
        }
        else {
            document.getElementById('diary-modal').classList.add('hidden')
            panel.classList.remove("xl:w-xl")
            panel.classList.remove("xl:h-[970px]")

            onDiaryClose(null)
        }
    });
}

async function saveDiaryEntry(e) {
    e.preventDefault();

    const pain_points_id = ["neck", "jaw", "shoulder", "spine", "lowerback", "elbow", "hips", "hand", "knees", "ankle", "feet"];
    let pain_points_values = [];

    pain_points_id.forEach(pain_point => {
        pain_points_values.push(document.getElementById(pain_point).checked);
    });

    if(current_diary.id) {
        await updateDiary(
            current_diary.id,
            document.getElementById("stress").value,
            document.getElementById("pain").value,
            document.getElementById("stiffness").value,
            document.getElementById("sleep").value,
            document.getElementById("notes").value
        )
    }
    else {
        await postDiary(
            document.getElementById("stress").value,
            document.getElementById("pain").value,
            document.getElementById("stiffness").value,
            document.getElementById("sleep").value,
            document.getElementById("notes").value,
            document.getElementById("date-picker").value,
        )
    }

    spawnStatusBar("Päiväkirjamerkintä tallennettu!", "bg-brand-green", "text-white", false);

    toggleDiary();
}

function spawnStatusBar(text, background, text_color, persistent) {
    const status_bar = document.getElementById('statusBar');
    status_bar.className = status_bar.className
        .split(' ')
        .filter(cls => !cls.startsWith('bg-'))
        .join(' ');

    status_bar.classList.remove('top-[-70px]');
    status_bar.classList.add('top-0', background);

    const status_bar_text = document.getElementById("status-bar-text")

    status_bar_text.className = status_bar_text.className
        .split(' ')
        .filter(cls => !cls.startsWith('bg-') && !cls.startsWith('text-'))
        .join(' ');
   
    status_bar_text.innerHTML = text
    status_bar_text.classList.add(text_color)

    // Hide after 5 seconds
    if(!persistent) {
        setTimeout(() => {
            closeStatusBar()
        }, 5000);
    }
}

function closeStatusBar() {
    const status_bar = document.getElementById('statusBar');

    status_bar.classList.remove('top-0');
    status_bar.classList.add('top-[-70px]');
}

async function onPageLoad() {
    console.log("loaded")

    const welcome_text = document.getElementById("welcome-text");

    welcome_text.innerHTML = `${localStorage.getItem("user_fname")}`;

    generateThisWeekEntries()

    const data = await getAllKubiosResults(localStorage.getItem("kubios_token"))
    const graph_result = await generateThisWeekGraph(state, data, document.getElementById('weekdayChart'));

    document.getElementById("weekly-avg").innerHTML = state.average_rmssd.toFixed(1);
}


function resetDiaryWidget(div) {
    div.classList.add("bg-white");
    div.classList.add("text-gray-900");
    div.classList.remove("text-white");
    div.classList.remove("bg-brand-red");
}

function onDiaryClose(currently_active) {
    const widget = document.getElementById("week-calendar");

    for (let child of widget.children) {
        if(child != currently_active) {
            resetDiaryWidget(child);
            child.open = false;
        }
    }
}

async function generateThisWeekEntries() {
    const entries = await getDiary();

    const weekDays = getWeekDays();

    let today = new Date().getDay();
    let today_iso = new Date()
        .toISOString()
        .slice(0, 10)

    let found_today = false
    entries.map((entry) => {
        if(entry.entry_date == today_iso) {
            found_today = true;
        }
    })

    if(!found_today) {
        spawnStatusBar("Et ole täyttänyt päiväkirjaa tänään!", "bg-brand-red", "text-white", true);
    }

    // Convert to managable index
    if(today == 0)
        today = 7;

    const widget = document.getElementById("week-calendar");
    for(let i = 0; i < weekDays.length; i++) {
        const div = document.createElement('div')
        div.classList.add("text-gray-900")

        const found_entry = entries.find(entry => {
            return entry.entry_date == weekDays[i].full_date
        });

        let data = {
            date: weekDays[i].full_date,
            pain: 0,
            stress: 0,
            stiffness: 0,
            sleep: 0,
            notes: "",
        };

        if(found_entry) {
            data = {
                date: found_entry.entry_date,
                pain: found_entry.pain_gauge,
                stress: found_entry.stress_gauge,
                stiffness: found_entry.stiffness_gauge,
                sleep: found_entry.sleep_gauge,
                notes: found_entry.notes,

                id: found_entry.entry_id
            }
        }

        let highlight = false;

        if(i == today-1) {
            highlight = true;
        }

        if(highlight) {
            div.classList.add("text-white","flex", "group", "text-gray-100", "hover:bg-brand-red", "bg-brand-red", "rounded-full", "mx-1", "cursor-pointer", "justify-center", "relative", "w-16", "shadow-offset-4", "transition-all", "duration-200");

            div.innerHTML = `
            <span class="flex h-2 w-2 absolute bottom-1.5 ">
            <span class="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-brand-red "></span>
            <span class="relative inline-flex rounded-full h- w-3 bg-brand-dark"></span>
            </span>
            <div class='flex items-center px-4 my-2 py-4'>
                <div class='text-center'>
                    <p class='group-hover:text-gray-100 text-xl transition-all group-hover:font-semibold duration-200'> ${weekDays[i].date} </p>
                    <p class='group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-200'> ${weekDays[i].weekday} </p>
                </div>
            </div>
            `
        }
        else {
            div.classList.add("bg-white", "flex", "group", "hover:bg-brand-red", "hover:shadow-lg", "hover-dark-shadow", "rounded-full", "mx-1", "cursor-pointer", "transition-all", "duration-200", "justify-center", "w-16", "shadow-offset-4")

            div.innerHTML = `
            <div class='flex items-center px-4 py-4'>
                <div class='text-center'>
                    <p class='group-hover:text-gray-100 font-semibold text-xl group-hover:font-bold transition-all duration-300'> ${weekDays[i].date} </p>
                    <p class='group-hover:text-gray-100 mt-3 transition-all group-hover:font-semibold duration-300'> ${weekDays[i].weekday} </p>
                </div>
            </div>
            `
        }

        div.addEventListener('click', (e) => {
            if(div.open) {
                div.open = false

                resetDiaryWidget(div);

                toggleDiary();
            }
            else {                              
                div.classList.remove("text-gray-900");
                div.classList.remove("bg-white");
                div.classList.add("text-white");
                div.classList.add("bg-brand-red");

                div.open = true;

                openImportDiaryEntry(data);
            }

            onDiaryClose(div);
        });

        widget.appendChild(div);
    }
}

addEventListener('userdata', onPageLoad)

document.getElementById("diaryentry").addEventListener("submit", saveDiaryEntry);
document.getElementById("close-diary").addEventListener("click", toggleDiary);

const close_button = document.getElementById("close-status-bar");
close_button.addEventListener("click", closeStatusBar);