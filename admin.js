// ===== Admin dashboard =====
// Reads the same saved appointments as the main site (via storage.js)
// and shows them grouped by date for clinic staff.

const schedule = document.getElementById("schedule");
const searchInput = document.getElementById("search");
const showSelect = document.getElementById("show");
const today = toDateString(new Date());

// ===== 1. Summary numbers =====
function updateStats(appointments) {
  const notDone = appointments.filter((appt) => !appt.done);
  document.getElementById("statToday").textContent = notDone.filter((a) => a.date === today).length;
  document.getElementById("statUpcoming").textContent = notDone.filter((a) => a.date >= today).length;
  document.getElementById("statDone").textContent = appointments.filter((a) => a.done).length;
  document.getElementById("statTotal").textContent = appointments.length;
}

// ===== 2. Which bookings to show =====
function filterAppointments(appointments) {
  const text = searchInput.value.trim().toLowerCase();
  const show = showSelect.value;

  return appointments.filter((appt) => {
    const matchesText =
      appt.name.toLowerCase().includes(text) || appt.phone.includes(text);
    const matchesDate =
      show === "all" ||
      (show === "today" && appt.date === today) ||
      (show === "upcoming" && appt.date >= today) ||
      (show === "past" && appt.date < today);
    return matchesText && matchesDate;
  });
}

// Turn "2026-10-06" into "Tuesday, 6 October 2026"
function niceDate(dateString) {
  return new Date(dateString + "T00:00").toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

// ===== 3. Draw the schedule =====
function render() {
  const all = loadAppointments();
  updateStats(all);

  // Sort by date, then by time
  const shown = filterAppointments(all).sort((a, b) =>
    (a.date + a.time).localeCompare(b.date + b.time)
  );

  schedule.innerHTML = "";
  if (shown.length === 0) {
    schedule.innerHTML = '<p class="empty-box">No appointments to show.</p>';
    return;
  }

  // Group bookings by date: { "2026-10-06": [appt, appt], ... }
  const groups = {};
  shown.forEach((appt) => {
    if (!groups[appt.date]) groups[appt.date] = [];
    groups[appt.date].push(appt);
  });

  Object.keys(groups).forEach((date) => {
    const heading = document.createElement("h3");
    heading.className = "day-heading";
    heading.textContent = niceDate(date) + (date === today ? " (Today)" : "");
    schedule.appendChild(heading);

    groups[date].forEach((appt) => schedule.appendChild(makeRow(appt)));
  });
}

// One booking as a row
function makeRow(appt) {
  const row = document.createElement("div");
  row.className = "booking" + (appt.done ? " done" : "");

  const time = document.createElement("div");
  time.className = "booking-time";
  time.textContent = appt.time;

  // textContent keeps patient input safe (no HTML injection)
  const info = document.createElement("div");
  info.className = "booking-info";
  const title = document.createElement("strong");
  title.textContent = `${appt.name} - ${appt.service}`;
  const contact = document.createElement("p");
  contact.textContent = `📞 ${appt.phone}   ✉️ ${appt.email}`;
  info.append(title, contact);
  if (appt.message) {
    const note = document.createElement("p");
    note.className = "booking-note";
    note.textContent = `"${appt.message}"`;
    info.appendChild(note);
  }

  const actions = document.createElement("div");
  actions.className = "booking-actions";
  const doneBtn = document.createElement("button");
  doneBtn.className = "btn btn-small";
  doneBtn.textContent = appt.done ? "Undo" : "Mark done";
  doneBtn.addEventListener("click", () => toggleDone(appt.id));
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "cancel-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteAppointment(appt.id));
  actions.append(doneBtn, deleteBtn);

  row.append(time, info, actions);
  return row;
}

// ===== 4. Actions =====
function toggleDone(id) {
  const appointments = loadAppointments().map((appt) =>
    appt.id === id ? { ...appt, done: !appt.done } : appt
  );
  saveAppointments(appointments);
  render();
}

function deleteAppointment(id) {
  if (!confirm("Delete this appointment?")) return;
  saveAppointments(loadAppointments().filter((appt) => appt.id !== id));
  render();
}

// Adds a few made-up bookings so the dashboard can be tried out
function addDemoBookings() {
  const names = ["Ayesha Raza", "Bilal Tariq", "Hina Shah", "Usman Ali", "Fatima Noor"];
  const services = ["Check-up", "Cleaning", "Filling", "Whitening", "Braces"];
  const times = ["09:00", "10:00", "11:00", "12:00"];
  const appointments = loadAppointments();
  const isTaken = (date, time) => appointments.some((a) => a.date === date && a.time === time);

  let added = 0;
  const day = new Date();
  // Walk forward day by day until 5 bookings are added (skip Sundays and taken slots)
  while (added < names.length) {
    const date = toDateString(day);
    const time = times[added % times.length];
    if (day.getDay() !== 0 && !isTaken(date, time)) {
      appointments.push({
        id: Date.now() + added,
        name: names[added],
        phone: `0300 00000${added}`,
        email: `patient${added + 1}@example.com`,
        service: services[added],
        date,
        time,
        message: added === 0 ? "Sensitive tooth on the left side." : "",
      });
      added++;
    }
    day.setDate(day.getDate() + 1);
  }
  saveAppointments(appointments);
  render();
}

// ===== 5. Connect events =====
searchInput.addEventListener("input", render);
showSelect.addEventListener("change", render);
document.getElementById("demoBtn").addEventListener("click", addDemoBookings);

// Refresh if a booking is made in another tab
window.addEventListener("storage", render);

render();
