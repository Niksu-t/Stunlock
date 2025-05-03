export function getThisWeeksWeekdays(weeks_ago = 0) {
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

export function getWeekDays() {
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

export function loop_required_fields(keys, object, message) {
  let error_found = false;

  keys.forEach(key => {
    reset_error(key);

    if(object[key].length == 0) {
        error_found = true;
        set_error(key, message)
    }

  return error_found;
}); 
}

export function reset_error(key) {
    const error_message = document.getElementById(`${key}-error`);
    error_message.classList.add("invisible")

    const widget = document.getElementById(key);
    widget.classList.remove("border-brand-red");
    widget.classList.add("border-transparent");
}

export function set_error(key, error) {
  if(error) {
      const error_message = document.getElementById(`${key}-error`);
      error_message.classList.remove("invisible")
      error_message.innerHTML = error
  }

  const widget = document.getElementById(key);
  widget.classList.add("border-brand-red")
  widget.classList.remove("border-transparent");
}

export function KubiosIsLoggedIn() {
  return localStorage.getItem("kubios_token") ? true : false;
}

export function KubiosTokenExpired() {
  const expires_at = localStorage.getItem("kubios_expires_at")
  const now = Date.now();

  return expires_at < now + 3200 * 1000;
}

export function HandleResponseKubios(response) {
  console.log(response);

  if(response.kubios_token) {
    localStorage.setItem("kubios_token", response.kubios_token);
    localStorage.setItem("kubios_expires_at", response.kubios_expires_at);
  }
}