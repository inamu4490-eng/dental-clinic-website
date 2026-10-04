# Project Plan: BrightSmile Dental Clinic Website

## 1. Goal
Build a simple, professional website for a (fictional) dental clinic, "BrightSmile Dental".
Visitors can learn about the clinic, see its services, read oral-care tips, and request an appointment.
The project teaches beginner web development: HTML (structure), CSS (design), and JavaScript (interaction).

## 2. Scope
**In scope**
- A single-page website that works on phones and computers
- An appointment request form with input checking (validation)
- Saving appointment requests in the browser (localStorage) and listing them on the page
- No server, no database, no payments. It runs by opening `index.html`.

**Out of scope (possible future upgrades)**
- Real online booking with a database and email confirmations
- Patient login, billing, or medical records

## 3. Required Features
| # | Feature | What it does |
|---|---------|--------------|
| 1 | Navigation bar | Links to each section; collapses into a menu on phones |
| 2 | Hero section | Clinic name, slogan, and a "Book Appointment" button |
| 3 | Services | Cards for Check-ups, Cleaning, Fillings, Whitening, Braces, Root Canal |
| 4 | About & Team | Short clinic story and dentist profiles |
| 5 | Oral-care tips | Simple tips on brushing, flossing, and diet |
| 6 | Appointment form | Name, phone, email, service, date, time, and message, with validation |
| 7 | My appointments | Shows saved requests, which you can cancel |
| 8 | Contact & hours | Address, phone, opening hours |
| 9 | Footer | Copyright and quick links |

## 4. Topics You Will Learn
- HTML: semantic tags (`header`, `section`, `form`, `footer`)
- CSS: variables, Flexbox, Grid, responsive design with media queries
- JavaScript: DOM selection, events, form validation, arrays and objects, `localStorage`

## 5. Final Deliverables
1. `index.html`: page structure and content
2. `styles.css`: all styling
3. `script.js`: menu toggle, form validation, saving and listing appointments
4. `PROJECT_PLAN.md`: this plan
5. `README.md`: how to run and how the code is organised

## 6. Phases
1. **Planning:** decide the sections, colours, and content. *(Done: this document)*
2. **HTML structure:** write all sections with real text, no styling yet.
3. **CSS styling:** colours, fonts, layout, cards, buttons.
4. **Responsive design:** make it look good on phone, tablet, and desktop.
5. **JavaScript interaction:** mobile menu, form validation, and error messages.
6. **Saving data:** store appointments in `localStorage`, show and cancel them.
7. **Testing:** try empty fields, wrong email, past dates, and different screen sizes.
8. **Polish & document:** fix bugs, write the README, and optionally publish with GitHub Pages.

### Version 2 (done)
9. **Patient reviews:** a testimonials section with star ratings.
10. **FAQ:** common questions that open and close when clicked (`<details>` tag).
11. **Smart booking rules:**
    - Sundays are closed.
    - Saturdays have morning slots only.
    - A time slot that's already booked can't be booked again.
    - Booked times are greyed out and become free again when cancelled.

### Version 3 (done)
12. **Staff dashboard** (`admin.html`):
    - bookings grouped by date
    - Today, Upcoming, Completed and Total counts
    - search and filters
    - mark done and delete buttons
    - demo bookings for trying it out
13. **Shared code:** `storage.js` holds the save and load functions both pages use.
14. **Git:** the project is now a Git repository, ready for GitHub.

### Ideas for Version 4
- Dark mode toggle
- Publish online with GitHub Pages
- Real backend (Node.js or Python + database) with email confirmations

## 7. Suggested Timeline (about 2 weeks)
| Days | Phase |
|------|-------|
| 1 | Phase 1 |
| 2–3 | Phase 2 |
| 4–6 | Phases 3–4 |
| 7–10 | Phases 5–6 |
| 11–12 | Phase 7 |
| 13–14 | Phase 8 |
