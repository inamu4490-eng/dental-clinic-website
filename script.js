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

// Close the menu with the Escape key, and put focus back on the ☰ button
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks.classList.contains("open")) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

// Close the menu when tapping anywhere outside it
document.addEventListener("click", (event) => {
  const clickedInsideMenu = navLinks.contains(event.target) || menuToggle.contains(event.target);
  if (!clickedInsideMenu) setMenuOpen(false);
});

// ===== 2. Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== 3. Appointment form =====
const form = document.getElementById("appointmentForm");
const successMsg = document.getElementById("successMsg");
const list = document.getElementById("appointmentList");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const serviceSelect = document.getElementById("service");
const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("time");
const messageInput = document.getElementById("message");

// Stop people from picking a date in the past (toDateString is in storage.js)
dateInput.min = toDateString(new Date());

// ===== Opening-hours rules =====
// getDay(): 0 = Sunday, 6 = Saturday
function dayOfWeek(dateString) {
  return new Date(dateString + "T00:00").getDay();
}

// Current time as "HH:MM", e.g. "14:05"
function timeNow() {
  return new Date().toTimeString().slice(0, 5);
}

// Is this time slot available on this date?
function isSlotOpen(dateString, time) {
  const day = dayOfWeek(dateString);
  if (day === 0) return false;                                                    // Sunday: closed
  if (day === 6 && time >= "13:00") return false;                                 // Saturday: mornings only
  if (dateString === toDateString(new Date()) && time <= timeNow()) return false; // already passed today
  return !loadAppointments().some((appt) => appt.date === dateString && appt.time === time);
}

// Does this date have at least one free time?
function hasFreeSlot(dateString) {
  return [...timeSelect.options].some((option) => option.value && isSlotOpen(dateString, option.value));
}

// Grey out time options that are closed, already booked, or already passed
function updateTimeOptions() {
  [...timeSelect.options].forEach((option) => {
    if (option.value === "") return;
    option.disabled = dateInput.value !== "" && !isSlotOpen(dateInput.value, option.value);
  });
  if (timeSelect.selectedOptions[0]?.disabled) timeSelect.value = "";
}

dateInput.addEventListener("change", updateTimeOptions);

// ===== Validation =====
// Each rule returns an error message, or "" if the field is fine.
const rules = {
  name: () =>
    nameInput.value.trim().length < 3 ? "Please enter your full name." : "",

  phone: () => {
    const value = phoneInput.value.trim();
    const digits = value.replace(/\D/g, "").length; // count only the numbers
    if (!/^[0-9+\-\s()]+$/.test(value) || digits < 7 || digits > 15) {
      return "Please enter a valid phone number (7 to 15 digits).";
    }
    return "";
  },

  email: () =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())
      ? "Please enter a valid email, like name@example.com."
      : "",

  service: () =>
    serviceSelect.value === "" ? "Please choose a service." : "",

  date: () => {
    const value = dateInput.value;
    if (value === "" || value < toDateString(new Date())) return "Please choose today or a future date.";
    if (dayOfWeek(value) === 0) return "Sorry, we are closed on Sundays.";
    if (!hasFreeSlot(value)) return "No free times left on this day. Please pick another date.";
    return "";
  },

  time: () => {
    if (timeSelect.value === "") return "Please choose a time.";
    if (dateInput.value !== "" && !isSlotOpen(dateInput.value, timeSelect.value)) {
      return "This time is not available. Please pick another.";
    }
    return "";
  },
};

// Show or clear an error message under a field.
// aria-invalid tells screen readers the field has a problem.
function setError(input, message) {
  const field = input.parentElement;
  field.querySelector(".error").textContent = message;
  field.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "");
}

// Connect each error message to its field, so screen readers read it out
Object.keys(rules).forEach((id) => {
  const input = document.getElementById(id);
  const error = input.parentElement.querySelector(".error");
  error.id = id + "Error";
  input.setAttribute("aria-describedby", error.id);
});

// Check one field and show its message
function validateField(id) {
  const message = rules[id]();
  setError(document.getElementById(id), message);
  return message === "";
}

// Check every field. If something is wrong, move the cursor to the first problem.
function validateForm() {
  const badFields = Object.keys(rules).filter((id) => !validateField(id));
  if (badFields.length > 0) document.getElementById(badFields[0]).focus();
  return badFields.length === 0;
}

// Live checking: once a field shows an error, re-check it while the person fixes it,
// so the red message disappears as soon as the value is correct.
Object.keys(rules).forEach((id) => {
  const input = document.getElementById(id);
  ["input", "change"].forEach((eventName) => {
    input.addEventListener(eventName, () => {
      if (input.parentElement.classList.contains("invalid")) validateField(id);
      // A new date can make the chosen time valid or invalid
      if (id === "date" && timeSelect.parentElement.classList.contains("invalid")) validateField("time");
    });
  });
});

// ===== 4. Showing saved appointments =====
// loadAppointments() and saveAppointments() are in storage.js

// Draw the list of appointments on the page, earliest first
function renderAppointments() {
  const appointments = loadAppointments().sort((a, b) =>
    (a.date + a.time).localeCompare(b.date + b.time)
  );
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
    cancelBtn.setAttribute("aria-label", `Cancel ${appt.service} on ${appt.date} at ${appt.time}`);
    cancelBtn.addEventListener("click", () => cancelAppointment(appt));

    item.append(info, cancelBtn);
    list.appendChild(item);
  });
}

// Ask first, so a mistaken tap on a phone doesn't delete a booking
function cancelAppointment(appt) {
  if (!confirm(`Cancel your ${appt.service} appointment on ${appt.date} at ${appt.time}?`)) return;
  try {
    saveAppointments(loadAppointments().filter((a) => a.id !== appt.id));
  } catch {
    showMessage("Sorry, we couldn't cancel this booking. Please call us on (000) 123-4567.", true);
    return;
  }
  renderAppointments();
  updateTimeOptions(); // the cancelled slot becomes free again
}

// Show a green success message, or a red one if something went wrong
function showMessage(text, isError = false) {
  successMsg.textContent = text;
  successMsg.classList.toggle("failed", isError);
}

// ===== 5. Handle form submit =====
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  showMessage("");

  if (!validateForm()) return;

  const appointment = {
    id: Date.now(),
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    service: serviceSelect.value,
    date: dateInput.value,
    time: timeSelect.value,
    message: messageInput.value.trim(),
  };

  // Saving can fail if the browser blocks storage (for example some private modes)
  try {
    const appointments = loadAppointments();
    appointments.push(appointment);
    saveAppointments(appointments);
  } catch {
    showMessage("Sorry, your booking could not be saved in this browser. Please call us on (000) 123-4567.", true);
    return;
  }

  form.reset();
  updateTimeOptions();
  showMessage(`Thank you, ${appointment.name}! Your request for ${appointment.date} at ${appointment.time} has been received.`);
  renderAppointments();
});

// Show saved appointments when the page loads
renderAppointments();
