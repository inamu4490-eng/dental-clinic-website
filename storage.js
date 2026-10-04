// ===== Shared storage helpers =====
// Used by both the main site (script.js) and the admin page (admin.js),
// so the code for reading and saving appointments lives in one place.

const STORAGE_KEY = "appointments";

function loadAppointments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveAppointments(appointments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

// Turns a Date into "YYYY-MM-DD" using local time
// (toISOString() uses UTC, which can give the wrong day).
function toDateString(d) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}
