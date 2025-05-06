import dayjs from 'dayjs';

import { DayToFinnishString, KubiosIsLoggedIn, KubiosTokenExpired } from './utils';
import { drawRmssdGraph } from './graphs';
import { postDiary, getDiary, updateDiary, getAllKubiosResults } from "./fetch-api";
import { getThisWeeksWeekdays } from './utils';

const MoveDirection = {
    right: "right",
    left: "left"
}

let state = {
    average_percentage: 0,
    average_rmssd_week: 0,
    average_rmssd: 0,
    month_average_rmssd: 0,

    month_chart_month: null,
    week_chart_week: null,

    diary_entires: null,
    kubios_data: null,

    month_chart: null,
    week_chart: null
}

let current_diary = {
    id: null,
    div: null,
}

let open = false;

async function onPageLoad() {
    const data = await getAllKubiosResults(localStorage.getItem("kubios_token"))
    
    state.kubios_data = data.Data;

    if(!state.kubios_data) {
        state.kubios_data = [{
            rmssd_ms: 0
        }]
    }

    HandleGraphWidgets(state.kubios_data);
    

    const welcome_text = document.getElementById("welcome-text");
    welcome_text.innerHTML = `${JSON.parse(localStorage.getItem("user")).fname}`;

    await generateThisWeekEntries()
}

function GraphsHandleKubiosErrors(id) {
    if(!KubiosIsLoggedIn()) {
        document.getElementById(id).innerHTML = `
        <h1 class='text-brand-green text-xl font-semibold'>Liitä Kubios käyttäjä HRV-tiedon seurantaa varten!</h1>
        <p>Liitä käyttäjä <a class='text-brand-red font-semibold' href='/settings'>asetuksissa.</a></p>
        `;
        return false
    }
    else if(KubiosTokenExpired()) {
        document.getElementById(id).innerHTML = `
        <h1 class='text-brand-green text-2xl font-semibold'>Kubios istunto päättynyt!</h1>
        <p>Kirjaudu uudelleen <a class='text-brand-red font-semibold' href='/settings'>asetuksissa.</a></p>
        `;
        return false;
    }

    return true;
}

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
    document.getElementById(`${target}-text`).innerHTML = `
        <p id="weekly-avg-percent">${percent.toFixed(1)}${text}</p>
        <h1 class="text-brand-green text-6xl font-semibold"><span id="weekly-avg">${average.toFixed(1)}</span><span class="text-xl">ms</span></h1>
        <h1>RMSSD keskiarvo.</h1>`;
}


async function HandleGraphWidgets(data) {
    const sum = (total, number) => total + number;

    const average = data
        .map(item => item.rmssd_ms)
        .reduce(sum) / data.length;

    state.average_rmssd = average;

    const today = new Date();
    state.month_chart_month = today;
    state.week_chart_week = getStartOfWeek(today)

    DrawWeekGraph(state.week_chart_week);
    DrawMonthGraph();
}

async function DrawWeekGraph(today) {
    const this_week = state.kubios_data.filter(item => isOnWeek(new Date(item.date), today))

    console.log(today)
    console.log(this_week)
    const value_map = new Map(this_week.map(d => [d.date, d.rmssd_ms]));

    const weekdays = getThisWeeksWeekdays(today);

    const fi_weekdays = ["ma", "ti", "ke", "to", "pe", "la", "su"]

    let i = 0;
    const week_chart_data = weekdays.map(day => {
        return value_map.get(day) ?? 0
    });

    const graph_result = await drawRmssdGraph(week_chart_data, document.getElementById('weekdayChart'), fi_weekdays, state.week_chart);
    state.week_chart = graph_result.chart;

    const kubios_errors = GraphsHandleKubiosErrors("weekly-text");

    if(kubios_errors) {
        if(!graph_result.empty) {
            state.average_rmssd_week = graph_result.average_rmssd;

            let average_result = get_average_percent(state.average_rmssd, state.average_rmssd_week)

            set_widget_text(
                "weekly",
                average_result.decrease ? "% perustason alapuolella." : "% perustason yläpuolella.",
                state.average_rmssd_week,
                average_result.average
            )
        }
        else {
            document.getElementById("weekly-text").innerHTML = `
                <p id="weekly-avg-percent" class='text-brand-green text-2xl font-semibold'>Ei mittauksia!</p>
                <h1 class="text-brand-green text-6xl font-semibold"><span id="weekly-avg"></span><span class="text-xl"></span></h1>`
        }
    }

    const end_of_week_date = new Date(state.week_chart_week);
    end_of_week_date.setDate(end_of_week_date.getDate() + 7)

    document.getElementById("week-chart-text").innerHTML = `${state.week_chart_week.getDate()}.${state.week_chart_week.getMonth() + 1} - ${end_of_week_date.getDate()}.${end_of_week_date.getMonth() + 1}`
}

function isOnWeek(date, target_week) {
    const end_of_week = new Date(target_week);
    end_of_week.setDate(target_week.getDate() + 6);
  
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
  
    return target >= target_week && target <= end_of_week;
}

function getStartOfWeek(date) {
    const result = new Date(date);
    const day = result.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = (day === 0 ? -6 : 1 - day); // Shift Sunday (0) to previous Monday
    result.setDate(result.getDate() + diff);
    result.setHours(0, 0, 0, 0); // Optional: zero time
    return result;
}

async function DrawMonthGraph(input_month = null) {
    let today = new Date();

    if(input_month) {
        today = input_month;
    }
    
    const this_month = state.kubios_data.filter(item => isOnMonth(new Date(item.date), today))
    
    const month_range = generateDateRange(today.getFullYear(), today.getMonth())
    const month_value_map = new Map(this_month.map(d => [dayjs(d.date).format("D"), d.rmssd_ms]));
    const month_values = month_range.map(date => month_value_map.get(date) ?? 0);

    const month_graph_result = await drawRmssdGraph(month_values, document.getElementById('month-chart'), month_range, state.month_chart);

    const month_kubios_errors = GraphsHandleKubiosErrors("monthly-text");

    state.month_chart = month_graph_result.chart;

    if(month_kubios_errors) {
        if(!month_graph_result.empty) {
            state.month_average_rmssd = month_graph_result.average_rmssd;

            let month_average_result = get_average_percent(state.average_rmssd, state.month_average_rmssd)
            set_widget_text(
                "monthly",
                month_average_result.decrease ? "% perustason alapuolella." : "% perustason yläpuolella.",
                state.month_average_rmssd,
                month_average_result.average
            )
        }
        else {
            document.getElementById("monthly-text").innerHTML = `
                <p id="monthly-avg-percent" class='text-brand-green text-2xl font-semibold'>Ei mittauksia!</p>
                <h1 class="text-brand-green text-6xl font-semibold"><span id="monthly-avg"></span><span class="text-xl"></span></h1>
            `
        }
    }

    document.getElementById("month-chart-text").innerHTML = `${state.month_chart_month.getMonth() + 1}.${state.month_chart_month.getFullYear()}`
}

function isOnMonth(date_str, day) {
    const start_of_month = new Date(day.getFullYear(), day.getMonth(), 1);
    return date_str.getMonth() === start_of_month.getMonth() 
        && date_str.getFullYear() === start_of_month.getFullYear();
}

function generateDateRange(year, month) {
    const start = dayjs(`${year}-${String(month+1)}-01`);
    const daysInMonth = start.daysInMonth();

    return Array.from({ length: daysInMonth }, (_, i) =>
        start.add(i, 'day').format('D')
    );
}

function openImportDiaryEntry(data) {
    current_diary.id = null

    if(data.id) {
        current_diary.id = data.id
    }

    document.getElementById("date-picker").value = data.entry.entry_date
    document.getElementById("stress").value = data.entry.stress_gauge
    document.getElementById("pain").value = data.entry.pain_gauge
    document.getElementById("stiffness").value = data.entry.stiffness_gauge
    document.getElementById("sleep").value = data.entry.sleep_gauge
    document.getElementById("notes").value = data.entry.notes

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

    let pain_points_id = [];

    const pain_points = {
        TMJ: false,
        Cervical_Spine: false,
        Shoulder: false,
        Thoraic_Spine: false,
        Elbow: false,
        Lower_back_and_SI_Joints: false,
        Hands_fingers_and_wrist: false,
        Knees: false,
        Ankles: false,
        Feet_and_toes: false,
      }

    pain_points_id.forEach(pain_point => {
        pain_points_values.push(document.getElementById(pain_point).checked);
    });

    if(current_diary.id) {
        await updateDiary(
            current_diary.id,
            pain_points,
            document.getElementById("stress").value,
            document.getElementById("pain").value,
            document.getElementById("stiffness").value,
            document.getElementById("sleep").value,
            document.getElementById("notes").value
        )

        let found_entry = state.entries.find(entry => entry.entry_id == current_diary.id);
        found_entry.pain_points = pain_points;
        found_entry.stress_gauge = document.getElementById("stress").value
        found_entry.pain_gauge = document.getElementById("pain").value
        found_entry.stiffness_gauge = document.getElementById("stiffness").value
        found_entry.sleep_gauge = document.getElementById("sleep").value
        found_entry.notes = document.getElementById("notes").value
    }
    else {
        const response = await postDiary(
            pain_points,
            document.getElementById("stress").value,
            document.getElementById("pain").value,
            document.getElementById("stiffness").value,
            document.getElementById("sleep").value,
            document.getElementById("notes").value,
            document.getElementById("date-picker").value,
        )

        state.entries.push({
            entry_id: response.message,
            entry_date: document.getElementById("date-picker").value,
            pain_points: pain_points,
            stress_gauge: document.getElementById("stress").value,
            pain_gauge: document.getElementById("pain").value,
            stiffness_gauge: document.getElementById("stiffness").value,
            sleep_gauge: document.getElementById("sleep").value,
            notes: document.getElementById("notes").value,
        })

        current_diary.id = response.message;
    }

    current_diary.div.data = {
        entry: state.entries.find(entry => entry.entry_id == current_diary.id),
        id: current_diary.id
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

function onDiaryClose(currently_active) {
    current_diary.div.reset();
}

async function generateThisWeekEntries() {
    state.entries = await getDiary();
    let today = dayjs();
    let fourteen_days_ago = today.subtract(14, "day");

    let today_iso = new Date()
        .toISOString()
        .slice(0, 10)

    let found_today = false
    state.entries.map((entry) => {
        if(entry.entry_date == today_iso) {
            found_today = true;
        }
    })

    if(!found_today) {
        spawnStatusBar("Et ole täyttänyt päiväkirjaa tänään!", "bg-brand-dark", "text-white", true);
    }

    const widget = document.getElementById("week-calendar");
    for(let i = 0; i <= 14 + 1; i++) {
        const day = fourteen_days_ago.add(i, 'day');
        let highlight = false;

        const div = document.createElement('div')
        div.classList.add("text-gray-900")

        const found_entry = state.entries.find(entry => {
            return entry.entry_date == day.format('YYYY-MM-DD')
        });

        let data = {
            entry: {
                entry_date: day.format('YYYY-MM-DD'),
                pain_gauge: 0,
                stress_gauge: 0,
                stiffness_gauge: 0,
                sleep_gauge: 0,
                notes: "",
            }
        };
        
        if(found_entry) {
            data = {
                entry: found_entry,
                id: found_entry.entry_id
            }
        }
        div.data = data;

        if(data.entry.entry_date == today.format('YYYY-MM-DD')) {
            highlight = true;
        }
        

        if(highlight) {
            div.classList.add("text-white","flex", "group", "text-gray-100", "hover:bg-brand-red", "bg-brand-red", "rounded-full", "mx-1", "cursor-pointer", "justify-center", "relative", "min-w-20", "max-w-20", "shadow-offset-4", "transition-all", "duration-200");

            div.innerHTML = `
            <span class="flex h-2 w-2 absolute bottom-1.5 ">
            <span class="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-brand-red "></span>
            <span class="relative inline-flex rounded-full h- w-3 bg-brand-dark"></span>
            </span>
            <div class='flex items-center px-4 my-2 py-4'>
                <div class='text-center'>
                    <p class='group-hover:text-gray-100 text-xl transition-all group-hover:font-semibold duration-200'> ${DayToFinnishString(day.day())} </p>
                    <p class='group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-200'> ${day.date()} </p>
                </div>
            </div>
            `
            
            div.reset = () => {}
            div.set_active = () => {}
        }
        else {
            if(found_entry) {
                div.classList.add("bg-white", "flex", "group", "hover:bg-brand-red", "hover:shadow-lg", "hover-dark-shadow", "rounded-full", "mx-1", "cursor-pointer", "transition-all", "duration-200", "justify-center", "min-w-20", "max-w-20", "shadow-offset-4")
                div.reset = () => {
                    div.classList.remove("bg-brand-red");
                    div.classList.remove("text-white")
                    div.classList.add("bg-white");
                };
                div.set_active = () => {
                    div.classList.remove("bg-white");
                    div.classList.add("text-white");
                    div.classList.add("bg-brand-red");
                };
            }
            else {
                div.classList.add("bg-stone-600", "flex", "group", "hover:bg-brand-red", "hover:shadow-lg", "hover-dark-shadow", "rounded-full", "mx-1", "cursor-pointer", "transition-all", "duration-200", "justify-center", "min-w-20", "max-w-20", "shadow-offset-4")
                div.reset = () => {
                    div.classList.remove("bg-brand-red");
                    div.classList.add("bg-stone-600");
                }
                div.set_active = () => {
                    div.classList.add("bg-brand-red");
                    div.classList.remove("bg-stone-600");
                }
            }

            div.innerHTML = `
            <div class='flex items-center px-4 py-4'>
                <div class='text-center'>
                    <p class='group-hover:text-gray-100 font-semibold group-hover:font-bold transition-all duration-300'> ${DayToFinnishString(day.day())} </p>
                    <p class='group-hover:text-gray-100 mt-3 transition-all group-hover:font-semibold duration-300'> ${day.date()} </p>
                </div>
            </div>
            `
        }

        div.addEventListener('click', (e) => {
            if(div.open) {
                div.open = false
                toggleDiary();
            }
            else {        
                div.open = true;

                div.set_active();

                if(current_diary.div)
                    ResetDiary() 
                
                current_diary.div = div;
                openImportDiaryEntry(div.data);
            }
        });

        widget.appendChild(div);
    }

    container.scrollLeft = container.scrollWidth;
    targetScrollLeft = container.scrollWidth;
}

function ResetDiary() {
    current_diary.div.reset()
    current_diary.div.open = false;
}

function monthMove(direction) {
    if(state.month_chart) {
        state.month_chart.destroy()
        state.month_chart = null;
    }

    if(direction == MoveDirection.left) {
        state.month_chart_month.setMonth(state.month_chart_month.getMonth() - 1);
    }
    else {
        state.month_chart_month.setMonth(state.month_chart_month.getMonth() + 1);
    }

    DrawMonthGraph(state.month_chart_month)
}

function weekMove(direction) {
    if(state.week_chart) {
        state.week_chart.destroy()
        state.week_chart = null;
    }

    if(direction == MoveDirection.left) {
        state.week_chart_week.setDate(state.week_chart_week.getDate() - 7);
    }
    else {
        state.week_chart_week.setDate(state.week_chart_week.getDate() + 7);
    }

    DrawWeekGraph(state.week_chart_week)
}

addEventListener('userdata', onPageLoad)

/// Diary and status bar event listeners (close, save etc)
const close_button = document.getElementById("close-status-bar");
close_button.addEventListener("click", closeStatusBar);

document.getElementById("diaryentry").addEventListener("submit", saveDiaryEntry);
document.getElementById("close-diary").addEventListener("click", toggleDiary);


// Scrollable diary-bar
const container = document.getElementById('week-calendar');
const scrollLeft = document.getElementById('diary-left');
const scrollRight = document.getElementById('diary-right');

const SCROLL_STEP = 88;
let targetScrollLeft = container.scrollLeft;

function scrollToTarget(offset) {
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    targetScrollLeft = Math.max(0, Math.min(targetScrollLeft + offset, maxScrollLeft));

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
}

scrollLeft.addEventListener('click', () => scrollToTarget(-SCROLL_STEP));
scrollRight.addEventListener('click', () => scrollToTarget(SCROLL_STEP));

document.getElementById('month-left').addEventListener("click", () => monthMove(MoveDirection.left));
document.getElementById('month-right').addEventListener("click", () => monthMove(MoveDirection.right));

document.getElementById('week-left').addEventListener("click", () => weekMove(MoveDirection.left));
document.getElementById('week-right').addEventListener("click", () => weekMove(MoveDirection.right));