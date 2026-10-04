# Project Structure: BrightSmile Dental Clinic Website

This document explains **what the website contains**, **how visitors use it**, and **how the files and code connect**.
For the goal, scope, and phases, see [PROJECT_PLAN.md](PROJECT_PLAN.md).

---

## 1. Big Picture

The public website is a **single-page site**. All content sits on one page (`index.html`), split into **sections**.
Menu links jump to a section instead of loading a new page.
There's also a separate **staff dashboard** (`admin.html`), described in section 7.

```
┌─────────────────────────────────────────────┐
│                 index.html                  │  ← structure & content (HTML)
│   uses ↓ styles.css     uses ↓ script.js    │
└───────────┬─────────────────────┬───────────┘
            │                     │
   styles.css (looks)     script.js (behaviour)
   colours, layout,       menu, form checks,
   phone layout           booking rules, saving
                                  │
                                  ▼
                     Browser storage (localStorage)
                     key: "appointments"
```

| Layer | File | Job | Analogy |
|-------|------|-----|---------|
| Structure | `index.html` | What is on the page | The skeleton |
| Style | `styles.css` | How it looks | The skin and clothes |
| Behaviour | `script.js` | What happens when you click or type | The muscles and brain |
| Data | `localStorage` | Remembers appointments after a page refresh | A notebook kept in the browser |

---

## 2. Page Map (Sections in Order)

| # | Section | HTML id | In menu? | What it contains | Purpose |
|---|---------|---------|----------|------------------|---------|
| 0 | Header / Navigation | — | — | Logo, links, "Book Now" button, ☰ button on phones | Get around the page; always visible (sticky) |
| 1 | Hero | `#home` | Logo link | Headline, slogan, "Book an Appointment" button | First impression; leads to booking |
| 2 | Services | `#services` | ✅ | 6 cards: Check-ups, Cleaning, Fillings, Whitening, Braces, Root Canal | Show what the clinic offers |
| 3 | About & Team | `#about` | ✅ | Clinic story and 3 dentist cards (initials, name, specialty) | Build trust |
| 4 | Oral-Care Tips | `#tips` | ✅ | 5 tips (brushing, flossing, diet, toothbrush, visits) | Educate patients |
| 5 | Patient Reviews | `#reviews` | ❌ | 3 review cards with star ratings | Social proof |
| 6 | FAQ | `#faq` | ✅ | 4 questions that open and close when clicked | Answer common questions |
| 7 | Book an Appointment | `#appointment` | ✅ "Book Now" | Opening hours note, booking form, "My Appointments" list | **Main action of the site** |
| 8 | Contact | `#contact` | ✅ | Address, phone, email, opening-hours table | How to reach the clinic |
| 9 | Footer | — | — | © year (filled in automatically), clinic name | Page ending |

Backgrounds alternate between white and light blue (`.section-alt`) so each section stands out.

---

## 3. Features by Section

### 3.1 Navigation
- **Sticky header** stays at the top while scrolling.
- **Smooth scrolling** to sections (`scroll-behavior: smooth` in CSS).
- **Phone menu:** below 768px wide the links hide behind a ☰ button. Tapping ☰ opens the menu, and tapping a link closes it.

### 3.2 Information Sections (Services, About, Tips, Reviews, FAQ, Contact)
- Mostly **static content**: plain HTML styled with CSS.
- Cards use **CSS Grid** and wrap automatically: 3 per row on desktop, 1 on phones.
- The FAQ uses the HTML `<details>`/`<summary>` tags, so opening and closing needs **no JavaScript**.

### 3.3 Appointment Booking (the interactive part)
| Feature | How it works |
|---------|--------------|
| Form fields | Name, Phone, Email, Service, Date, Time, Message (optional) |
| No past dates | The date picker's minimum is set to today |
| No past times today | If the date is today, times that have already passed are greyed out |
| Sunday closed | Every time slot is greyed out, and an error appears if you try to submit |
| Saturday mornings only | 14:00 and later are greyed out |
| No double-booking | A date and time that's already booked is greyed out |
| Validation | Each field shows its own red error message. The cursor jumps to the first problem |
| Live checking | Once a field shows an error, it's re-checked while you type, so the message disappears when fixed |
| Phone rule | Only digits, spaces, `+ - ( )`, with 7 to 15 digits |
| Full day | If a date has no free times left, the date field says so |
| Screen readers | Each error is linked to its field (`aria-describedby`, `aria-invalid`) |
| Saving fails | If the browser blocks storage, a red message asks the visitor to call instead |
| Success message | "Thank you, [name]! Your request for [date] at [time]…" |
| Saving | The booking is stored in `localStorage` and stays after a refresh |
| My Appointments list | Shows every saved booking, earliest first, with a **Cancel** button |
| Cancelling | Asks "Cancel your … appointment?" first, then removes it and frees the time slot |

---

## 4. User Flows

### Flow A: A visitor learns about the clinic
```
Open site → Hero → scroll or click menu → Services → About → Tips → Reviews → FAQ → Contact
```

### Flow B: A visitor books an appointment (main flow)
```
1. Click "Book Now" (menu) or "Book an Appointment" (hero)
        ↓  page scrolls to #appointment
2. Fill in name, phone, email, service
        ↓
3. Pick a date  ──→  script greys out closed or booked times
        ↓
4. Pick a time, add an optional message
        ↓
5. Click "Request Appointment"
        ↓
6. Script checks every field
     ├── ❌ problem → red message under the field → the visitor fixes it → back to step 5
     └── ✅ all good →
            • booking saved to localStorage
            • form cleared
            • success message shown
            • booking appears in "My Appointments"
            • that time slot is now greyed out for that date
```

### Flow C: A visitor cancels an appointment
```
Go to "My Appointments" → click Cancel → confirm "Yes" → booking removed from storage → list updates → time slot free again
```

### Flow D: A visitor comes back later
```
Open site again → script reads localStorage → "My Appointments" shows earlier bookings
```

### Flow E: Phone user
```
Open on phone → tap ☰ → menu opens → tap a link → menu closes and page scrolls to that section
                                   └→ or tap outside the menu / press Escape → menu closes
```

---

## 5. How the Code Connects

### 5.1 HTML ↔ CSS
CSS styles elements through **class names** written in the HTML:

| HTML uses class | CSS gives it |
|-----------------|--------------|
| `container` | Centred content, max width 1100px |
| `section` / `section-alt` | Spacing and the alternating background |
| `cards` / `card` | Grid layout and white boxes with shadows |
| `btn` | Rounded blue buttons |
| `field`, `invalid`, `error` | Form layout, red border, red message |
| `nav-links open` | Shows the phone menu (`open` is added by JavaScript) |

Colours are defined once as **CSS variables** (`--primary`, `--accent`…) at the top of `styles.css` and reused everywhere.

### 5.2 HTML ↔ JavaScript
JavaScript finds elements by their **id**, then listens for events:

| HTML id | Used by JavaScript for |
|---------|------------------------|
| `menuToggle`, `navLinks` | Opening and closing the phone menu |
| `year` | Writing the current year in the footer |
| `appointmentForm` | Listening for **submit** |
| `name`, `phone`, `email`, `service`, `date`, `time`, `message` | Reading form values |
| `date` | Listening for **change**, which updates the time options |
| `successMsg` | Showing the thank-you message |
| `appointmentList` | Drawing the "My Appointments" list |

### 5.3 Inside `script.js`: Functions and Who Calls Whom
```
Page loads
 ├─ set footer year
 ├─ set minimum date = today            (toDateString)
 └─ renderAppointments()                → loadAppointments()

Date changes
 └─ updateTimeOptions()                 → isSlotOpen() → dayOfWeek(), timeNow(), loadAppointments()

Typing in a field that shows an error
 └─ validateField(id)                   → rules[id]() → setError()

Form submitted
 └─ validateForm()                      → validateField() for every field → focus first bad field
     └─ if valid:
          loadAppointments() → push the new booking → saveAppointments()
          (if saving fails → showMessage(red error) and stop)
          form.reset() → updateTimeOptions() → showMessage(thank you) → renderAppointments()

Cancel clicked
 └─ cancelAppointment(appt)             → confirm() → loadAppointments() → filter → saveAppointments()
                                          → renderAppointments() → updateTimeOptions()
```

| Function | One-line job |
|----------|--------------|
| `toDateString(d)` | Turns a date into `YYYY-MM-DD` using local time |
| `dayOfWeek(date)` | Returns 0 (Sun) to 6 (Sat) |
| `timeNow()` | Current time as `HH:MM` |
| `isSlotOpen(date, time)` | Returns true if the clinic is open, the time hasn't passed, and the slot isn't booked |
| `hasFreeSlot(date)` | Returns true if that date has at least one free time |
| `updateTimeOptions()` | Greys out unavailable times |
| `rules` | One small function per field that returns its error message, or `""` if it's fine |
| `setError(input, msg)` | Shows or clears the red message under a field, and sets `aria-invalid` |
| `validateField(id)` | Checks one field and shows its message |
| `validateForm()` | Checks every field, moves the cursor to the first problem, returns true or false |
| `showMessage(text, isError)` | Shows the green thank-you message, or a red one if saving failed |
| `loadAppointments()` | Reads the saved list from localStorage |
| `saveAppointments(list)` | Writes the list to localStorage |
| `renderAppointments()` | Rebuilds the "My Appointments" list on screen |
| `cancelAppointment(appt)` | Asks for confirmation, then deletes one booking |

### 5.4 Data Structure
Each booking is a JavaScript **object**. All bookings are kept in an **array**, saved as text (JSON) under the key `"appointments"`:

```json
[
  {
    "id": 1791138230539,
    "name": "Ali Hassan",
    "phone": "0300 1234567",
    "email": "ali@example.com",
    "service": "Cleaning",
    "date": "2026-10-06",
    "time": "10:00",
    "message": ""
  }
]
```
- `id` comes from `Date.now()` (milliseconds since 1970), so every booking gets a unique number. Cancel uses it to find the right booking.
- `date` + `time` together are what the "no double-booking" rule checks.

---

## 6. Folder Structure

```
dental project/
├── index.html          ← the public website (all sections)
├── admin.html          ← staff dashboard
├── styles.css          ← all styling for both pages + phone layout (@media)
├── storage.js          ← shared: load/save appointments, date helper
├── script.js           ← behaviour of the public website
├── admin.js            ← behaviour of the staff dashboard
├── .gitignore          ← files Git should not track
├── PROJECT_PLAN.md     ← goal, scope, phases
├── STRUCTURE.md        ← this document
├── README.md           ← how to run
└── .claude/launch.json ← local preview server settings (not part of the site)
```

---

## 7. Staff Dashboard (`admin.html`)

A second page for clinic staff, linked from the footer ("Clinic staff area").

| Part | What it does |
|------|--------------|
| Summary cards | Counts for Today, Upcoming, Completed, and Total bookings |
| Search box | Filters by patient name or phone |
| Show menu | Upcoming / Today only / Past / All |
| Schedule | Bookings grouped under date headings, sorted by time |
| Mark done / Undo | Greys out and strikes through a finished visit (saves `done: true`) |
| Delete | Removes a booking after a confirmation prompt |
| Add demo bookings | Adds 5 made-up bookings (skipping Sundays and taken slots) for trying it out |

**Staff flow:** Open site → footer "Clinic staff area" → see today's and upcoming bookings → mark visits done → "← Website" to go back.

**How the two pages share data:**
```
index.html ─ storage.js + script.js ─┐
                                     ├──▶ localStorage "appointments"
admin.html ─ storage.js + admin.js ──┘
```
`storage.js` holds `loadAppointments()`, `saveAppointments()`, and `toDateString()`, so both pages use the same code.
The admin page also refreshes on its own when a booking is made in another tab (the `storage` event).

---

## 8. Limits and How a Real Server Would Connect

| Current limit | Why | Future solution |
|---------------|-----|-----------------|
| Bookings are only visible in the browser that made them | localStorage lives in each visitor's own browser | A **server + database** so staff see every patient's booking |
| Anyone can open the staff page | No login without a server | Staff **login** checked by the server |
| No confirmation email | No server | The server sends an email after each booking |

With a server, the connection would change like this:
```
Now:     storage.js ──save/load──▶ localStorage (one browser)
Future:  storage.js ──fetch()────▶ Server (Node.js/Python) ──▶ Database
```
Because all saving and loading is in `storage.js`, only that one file would need to change.
