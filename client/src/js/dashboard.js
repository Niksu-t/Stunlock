import { getWeekDays } from './utils';
import { drawRmssdGraph } from './graphs';
import { postDiary, getDiary, updateDiary, getAllKubiosResults } from "./fetch-api";
import { getThisWeeksWeekdays } from './utils';

let state = {
    average_percentage: 0,
    average_rmssd: 0,
    month_average_rmssd: 0
}

let current_diary = {
    id: null,
}

let open = false;

async function onPageLoad() {
    const get_average_percent = (average, target_average) => {
        let decrease = false
        let dif = target_average - average;
        if(target_average < average) {
            dif = average - target_average;
            decrease = true;
        }

        return {
            average: dif / average * 100,
            decrease
        }; 
    }

    const set_widget_text = (target, text, average, percent) => {
        document.getElementById(`${target}-percent`).innerHTML = `${percent.toFixed(1)}${text}`;
        document.getElementById(target).innerHTML = average.toFixed(1);
    }

    const today = new Date();
    const data = await getAllKubiosResults(localStorage.getItem("kubios_token"))

    const sum = (total, number) => total + number;

    const average = data.Data
        .map(item => item.rmssd_ms)
        .reduce(sum) / data.Data.length;
    console.log(average)

    const this_week = data.Data.filter(item => isOnWeeksAgo(new Date(item.date), 0))
    const weekdays = getThisWeeksWeekdays();

    const welcome_text = document.getElementById("welcome-text");
    welcome_text.innerHTML = `${JSON.parse(localStorage.getItem("user")).fname}`;

    generateThisWeekEntries()

    let week_chart_data = [];
    const fi_weekdays = ["ma", "ti", "ke", "to", "pe", "la", "su"]

    let i = 0;
    weekdays.forEach(date => {
        if(this_week[i]) {
            if(date == this_week[i].date) {
                week_chart_data.push(this_week[i].rmssd_ms);
                i++;
            } else {
                week_chart_data.push(0)
            }
        }
    });

    const graph_result = await drawRmssdGraph(week_chart_data, document.getElementById('weekdayChart'), fi_weekdays);
    state.average_rmssd = graph_result.average_rmssd;

    let average_result = get_average_percent(average, state.average_rmssd)

    set_widget_text(
        "weekly-avg",
        average_result.decrease ? "% perustason alapuolella." : "% perustason yläpuolella.",
        state.average_rmssd,
        average_result.average
    )

    const this_month = data.Data.filter(item => isOnMonth(new Date(item.date), new Date(), 1))
    let month_chart_data = [];
    let month_chart_labels = [];
    const days_this_month = getDaysInMonth(today.getFullYear(), today.getMonth());

    let month_index = 0
    for(let i = 1; i < days_this_month; i++) {
        const day = new Date();
        day.setDate(i)

        if(this_month[month_index]) {
            if(day.toISOString().slice(8, 10) == this_month[month_index].date.slice(8, 10)) {
                month_chart_data.push(this_month[month_index].rmssd_ms);
                month_index++;
            } else {
                month_chart_data.push(0)
            }
        }
        month_chart_labels.push(i);
    }

    const month_graph_result = await drawRmssdGraph(month_chart_data, document.getElementById('month-chart'), month_chart_labels);
    state.month_average_rmssd = month_graph_result.average_rmssd;

    let month_average_result = get_average_percent(average, state.month_average_rmssd)

    set_widget_text(
        "monthly-avg",
        month_average_result.decrease ? "% perustason alapuolella." : "% perustason yläpuolella.",
        state.month_average_rmssd,
        month_average_result.average
    )
}

function isOnWeeksAgo(dateStr, num_of_weeks = 0) {
    const now = new Date();
  
    const dayOfWeek = now.getDay(); // Sunday = 0
    const diffToMonday = (dayOfWeek + 6) % 7;
  
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - diffToMonday);
    startOfThisWeek.setHours(0, 0, 0, 0);
  
    const startOfTargetWeek = new Date(startOfThisWeek);
    startOfTargetWeek.setDate(startOfThisWeek.getDate() - num_of_weeks * 7);
  
    const endOfTargetWeek = new Date(startOfTargetWeek);
    endOfTargetWeek.setDate(startOfTargetWeek.getDate() + 6);
    endOfTargetWeek.setHours(23, 59, 59, 999);
  
    return dateStr >= startOfTargetWeek && dateStr <= endOfTargetWeek;
}

function isOnMonth(date_str, today, months_ago = 0) {
    const start_of_month = new Date(today.getFullYear(), today.getMonth() - months_ago, 1);
    return date_str.getMonth() === start_of_month.getMonth() 
        && date_str.getFullYear() === start_of_month.getFullYear();
}

function getDaysInMonth(year, target_month) {
    return new Date(year, target_month + 1, 0).getDate();
}

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