// ===== 1. Mobile menu toggle =====
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Open or close the menu, and tell screen readers which it is
function setMenuOpen(isOpen) {
  navLinks.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(!navLinks.classList.contains("open"));
});

// Close the menu after a link is clicked (on phones)
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

// ===== 2. Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== 3. Appointment form =====
const form = document.getElementById("appointmentForm");
const successMsg = document.getElementById("successMsg");
const list = document.getElementById("appointmentList");
const dateInput = document.getElementById("date");

const timeSelect = document.getElementById("time");

// Stop people from picking a date in the past (toDateString is in storage.js)
const today = toDateString(new Date());
dateInput.min = today;

// ===== Opening-hours rules =====
// getDay(): 0 = Sunday, 6 = Saturday
function dayOfWeek(dateString) {
  return new Date(dateString + "T00:00").getDay();
}

// Is this time slot available on this date?
function isSlotOpen(dateString, time) {
  const day = dayOfWeek(dateString);
  if (day === 0) return false;                  // Sunday: closed
  if (day === 6 && time >= "13:00") return false; // Saturday: mornings only
  return !loadAppointments().some((appt) => appt.date === dateString && appt.time === time);
}

// Grey out time options that are closed or already booked
function updateTimeOptions() {
  [...timeSelect.options].forEach((option) => {
    if (option.value === "") return;
    option.disabled = dateInput.value !== "" && !isSlotOpen(dateInput.value, option.value);
  });
  if (timeSelect.selectedOptions[0]?.disabled) timeSelect.value = "";
}

dateInput.addEventListener("change", updateTimeOptions);

// Show or clear an error message under a field
function setError(input, message) {
  const field = input.parentElement;
  field.querySelector(".error").textContent = message;
  field.classList.toggle("invalid", message !== "");
}

// Check every field and return true if all are valid
function validateForm() {
  let valid = true;

  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");
  const service = document.getElementById("service");
  const time = timeSelect;
  const closedDay = dateInput.value !== "" && dayOfWeek(dateInput.value) === 0;

  const checks = [
    [name, name.value.trim().length < 3, "Please enter your full name."],
    [phone, !/^[0-9+\-\s]{7,15}$/.test(phone.value.trim()), "Please enter a valid phone number."],
    [email, !/^\S+@\S+\.\S+$/.test(email.value.trim()), "Please enter a valid email."],
    [service, service.value === "", "Please choose a service."],
    [dateInput, dateInput.value === "" || dateInput.value < today, "Please choose a future date."],
    [dateInput, closedDay, "Sorry, we are closed on Sundays."],
    [time, time.value === "", "Please choose a time."],
    [time, time.value !== "" && dateInput.value !== "" && !isSlotOpen(dateInput.value, time.value),
      "This time is not available. Please pick another."],
  ];

  // Clear old errors, then show only the first problem for each field
  checks.forEach(([input]) => setError(input, ""));
  const fieldsWithError = new Set();
  checks.forEach(([input, hasError, message]) => {
    if (hasError && !fieldsWithError.has(input)) {
      setError(input, message);
      fieldsWithError.add(input);
      valid = false;
    }
  });

  return valid;
}

// ===== 4. Showing saved appointments =====
// loadAppointments() and saveAppointments() are in storage.js

// Draw the list of appointments on the page
function renderAppointments() {
  const appointments = loadAppointments();
  list.innerHTML = "";

  if (appointments.length === 0) {
    list.innerHTML = '<li class="empty">No appointments yet.</li>';
    return;
  }

  appointments.forEach((appt) => {
    const item = document.createElement("li");
    const info = document.createElement("div");
    info.innerHTML = `<strong></strong><br><span></span>`;
    // textContent keeps user input safe (no HTML injection)
    info.querySelector("strong").textContent = `${appt.service}: ${appt.name}`;
    info.querySelector("span").textContent = `${appt.date} at ${appt.time}`;

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-btn";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => cancelAppointment(appt.id));

    item.append(info, cancelBtn);
    list.appendChild(item);
  });
}

function cancelAppointment(id) {
  const remaining = loadAppointments().filter((appt) => appt.id !== id);
  saveAppointments(remaining);
  renderAppointments();
  updateTimeOptions(); // the cancelled slot becomes free again
}

// ===== 5. Handle form submit =====
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  successMsg.textContent = "";

  if (!validateForm()) return;

  const appointment = {
    id: Date.now(),
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    service: document.getElementById("service").value,
    date: dateInput.value,
    time: timeSelect.value,
    message: document.getElementById("message").value.trim(),
  };

  const appointments = loadAppointments();
  appointments.push(appointment);
  saveAppointments(appointments);

  form.reset();
  updateTimeOptions();
  successMsg.textContent = `Thank you, ${appointment.name}! Your request for ${appointment.date} at ${appointment.time} has been received.`;
  renderAppointments();
});

// Show saved appointments when the page loads
renderAppointments();
