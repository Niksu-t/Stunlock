import { postDiary, getDiary, updateDiary } from "./fetch-api";
import dayjs from 'dayjs';

let open = false;

function openImportDiaryEntry(entry) {
    console.log(entry);

    const diaryContent = document.getElementById("diary-content")

    if(!open) {
        toggleDiary();
    }
}

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

function generateThisWeekEntries(e) {
    const weekDays = getWeekDays();
    const today = new Date().getDay();

    // Convert to managable index
    if(today == 0)
        today = 6;

    const widget = document.getElementById("week-calendar");

    for(let i = 0; i < weekDays.length; i++) {
        const div = document.createElement('div')

        let highlight = false;

        if(i == today-1) {
            highlight = true;
        }

        if(highlight) {
            div.innerHTML = `
            <div class='flex group bg-brand-red shadow-lg dark-shadow rounded-full mx-1 cursor-pointer justify-center relative  w-16'>
            <span class="flex h-2 w-2 absolute bottom-1.5 ">
              <span class="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-brand-red "></span>
              <span class="relative inline-flex rounded-full h- w-3 bg-purple-100"></span>
            </span>
              <div class='flex items-center px-4 my-2 py-4'>
                  <div class='text-center'>
                     <p class='text-gray-100 text-sm font-semibold'> ${weekDays[i].weekday} </p>
                     <p class='text-gray-100  mt-3 font-bold'> ${weekDays[i].date} </p>
                  </div>
              </div>
          </div>
            `
        }
        else {
            div.innerHTML = `
            <div class='flex group hover:bg-brand-red hover:shadow-lg hover-dark-shadow rounded-full mx-1 transition-all duration-300 cursor-pointer justify-center  w-16'>
                <div class='flex items-center px-4 py-4'>
                    <div class='text-center'>
                        <p class='text-gray-900 group-hover:text-gray-100 text-sm transition-all  group-hover:font-semibold duration-300'> ${weekDays[i].weekday} </p>
                        <p class='text-gray-900 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all	duration-300'> ${weekDays[i].date} </p>
                    </div>
                </div>
            </div>
            `
        }

        div.addEventListener('click', (e) => {
            openImportDiaryEntry(i);
        });

        widget.appendChild(div);
    }
}

function getWeekDays() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const monday = new Date(today);
    const diffToMonday = (dayOfWeek + 6) % 7;
    monday.setDate(today.getDate() - diffToMonday);
  
    const weekdaysFI = ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'];
  
    const week = [];
  
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
  
      const weekday = weekdaysFI[day.getDay()];
      const date = day.getDate(); // just the day number
  
      week.push({ weekday, date });
    }
  
    return week;
}

// TODO: Add entry widget
//document.getElementById("submit-diary").addEventListener("click", postOrUpdateEntry);

document.getElementById("diary-toggle").addEventListener("click", toggleDiary);
addEventListener('load', generateThisWeekEntries)