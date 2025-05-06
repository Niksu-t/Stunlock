export function getThisWeeksWeekdays(target_week) {
  const monday = new Date(target_week);
  monday.setHours(0, 0, 0, 0); // Normalize time

  const weekdays = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekdays.push(date.toISOString().slice(0, 10)); // 'YYYY-MM-DD'
  }

  return weekdays;
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

  return expires_at < now;
}

export function HandleResponseKubios(response) {
  console.log(response);

  if(response.kubios_token) {
    localStorage.setItem("kubios_token", response.kubios_token);
    localStorage.setItem("kubios_expires_at", response.kubios_expires_at);
  }
}

export function DayToFinnishString(index) {
  const fi_weekdays = ["ma", "ti", "ke", "to", "pe", "la", "su"]
  return fi_weekdays[index];
}