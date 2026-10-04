# BrightSmile Dental Clinic Website

A beginner-friendly website for a fictional dental clinic, built with plain HTML, CSS, and JavaScript.

## How to run
Double-click `index.html` to open it in your web browser. No installation is needed.

## Files
| File | Purpose |
|------|---------|
| `index.html` | Page structure and content (all sections) |
| `styles.css` | Colours, layout, and mobile design |
| `script.js` | Mobile menu, form validation, saving and cancelling appointments |
| `storage.js` | Shared code for loading and saving appointments (used by both pages) |
| `admin.html` / `admin.js` | Staff dashboard: bookings grouped by date, search, mark done, delete |
| `PROJECT_PLAN.md` | Goal, scope, features, and phases |
| `STRUCTURE.md` | Sections, user flows, features, and how the code connects |

## Features
- Responsive layout that works on phones, tablets, and desktops
- Services, team, oral-care tips, contact, and opening hours
- Appointment form that checks name, phone, email, service, future date, and time
- Appointments are saved in your browser (`localStorage`) and can be cancelled
- Patient reviews and a clickable FAQ
- Booking rules: closed on Sundays, mornings only on Saturdays, and no double-booking of a time slot
- Staff dashboard (`admin.html`, linked in the footer): summary numbers, search, filters, "Add demo bookings" button

## Note
Appointments are stored only in the browser you used. A real clinic would need a server and database. That's a good next project.
