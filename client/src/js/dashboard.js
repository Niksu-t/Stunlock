import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import dayjs from 'dayjs';

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
    console.log(data)
    let chart_data = [];

    const weekdays = getThisWeeksWeekdays();
    console.log(weekdays)

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

    console.log(chart_data)

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

function getThisWeeksWeekdays(weeks_ago = 0) {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day - weeks_ago * 7;
  
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

async function generateThisWeekEntries(e) {
    const entries = await getDiary();

    const weekDays = getWeekDays();
    let today = new Date().getDay();

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
            pain: 5,
            stress: 5,
            stiffness: 5,
            sleep: 5,
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

                openImportDiaryEntry(data);
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
      const full_date = day.toISOString().slice(0, 10)
  
      week.push({ weekday, date, full_date});
    }
  
    return week;
}

// TODO: Add entry widget
//document.getElementById("submit-diary").addEventListener("click", postOrUpdateEntry);
Chart.register(annotationPlugin);

addEventListener('userdata', onPageLoad)

document.getElementById("diaryentry").addEventListener("submit", saveDiaryEntry);