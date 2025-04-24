import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import dayjs from 'dayjs';

import { postDiary, getDiary, updateDiary, getAllKubiosResults } from "./fetch-api";

let state = {
    average_percentage: 0,
    average_rmssd: 0,
}

function getThisWeeksWeekdays() {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
  
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
  
    const weekdays = [];
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekdays.push(date.toISOString().slice(0, 10)); // 'YYYY-MM-DD'
    }
  
    return weekdays;
}

let open = false;

function openImportDiaryEntry(entry) {
    console.log(entry);

    const diaryContent = document.getElementById("diary-content")

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
            panel.classList.add("xl:h-[1100px]")
        }
        else {
            document.getElementById('diary-modal').classList.add('hidden')
            panel.classList.remove("xl:w-xl")
            panel.classList.remove("xl:h-[1100px]")
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

async function onPageLoad(e) {
    const welcome_text = document.getElementById("welcome-text");

    welcome_text.innerHTML = `${localStorage.getItem("user_fname")}`;

    generateThisWeekEntries(e)
    await generateThisWeekGraph();

    document.getElementById("weekly-avg").innerHTML = state.average_rmssd.toFixed(1);
}

async function generateThisWeekGraph() {
    const data = await getAllKubiosResults(localStorage.getItem("kubios_token"));
    let chart_data = [];

    const weekdays = getThisWeeksWeekdays();

    const ctx = document.getElementById('weekdayChart');

    let i = 0;
    weekdays.forEach(date => {
        if(data.Data[i]) {
            if(date == data.Data[i].date) {
                chart_data.push(data.Data[i].rmssd_ms);
                i++;
            }
        }
    });

    console.log(chart_data);

    const sum = (total, number) => total + number;
    const average = chart_data.reduce(sum) / chart_data.length;

    state.average_rmssd = average;


    const annotation = {
        type: 'line',
        borderColor: 'rgba(109, 186, 161, 1)',
        borderDash: [6, 6],
        borderDashOffset: 0,
        borderWidth: 3,
        label: {
          enabled: true,
          content: null,
          position: 'end'
        },
        scaleID: 'y',
        value: average
      };

    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'],
        datasets: [{
            label: 'RMSSD',
            data: chart_data,
            backgroundColor: 'rgba(247, 108, 94, 1)',
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
        },
        options: {
            maintainAspectRatio: false,

            plugins: {
                legend: {
                display: false
                },
                tooltip: {
                mode: 'index',
                intersect: false
                },

                annotation: {
                    annotations: {
                      annotation
                    }
                  }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function generateThisWeekEntries(e) {
    const weekDays = getWeekDays();
    let today = new Date().getDay();

    // Convert to managable index
    if(today == 0)
        today = 6;

    const widget = document.getElementById("week-calendar");

    for(let i = 0; i < weekDays.length; i++) {
        const div = document.createElement('div')
        div.classList.add("text-gray-900")

        let highlight = false;

        if(i == today-1) {
            highlight = true;
        }

        if(highlight) {
            div.classList.add("flex", "group", "bg-brand-red", "shadow-lg", "dark-shadow", "rounded-full", "mx-1", "cursor-pointer", "justify-center", "relative", "w-16");

            div.today = true;

            div.innerHTML = `
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
            `
        }
        else {
            div.classList.add("not-today", "flex", "group", "hover:bg-brand-red", "hover:shadow-lg", "hover-dark-shadow", "rounded-full", "mx-1", "cursor-pointer", "transition-all", "duration-300", "justify-center", "w-16")

            div.innerHTML = `
            <div class='flex items-center px-4 py-4'>
                <div class='text-center'>
                    <p class='group-hover:text-gray-100 text-sm transition-all group-hover:font-semibold duration-300'> ${weekDays[i].weekday} </p>
                    <p class='group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300'> ${weekDays[i].date} </p>
                </div>
            </div>
            `
        }

        const close = (div) => {
            if(!div.today) {
                div.classList.add("text-gray-900");
                div.classList.remove("text-gray-100");
                div.classList.remove("bg-brand-red");
            }
        } 

        div.addEventListener('click', (e) => {
            if(div.open) {
                div.open = false

                close(div);

                toggleDiary();
            }
            else {                              
                div.classList.remove("text-gray-900");
                div.classList.add("text-gray-100");
                div.classList.add("bg-brand-red");

                div.open = true;

                openImportDiaryEntry(i);
            }

            for (let child of widget.children) {
                if(child.classList.contains("not-today") && child != div) {
                    close(child);
                    child.open = false;
                }
            }

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
Chart.register(annotationPlugin);

addEventListener('userdata', onPageLoad)