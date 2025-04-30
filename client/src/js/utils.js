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