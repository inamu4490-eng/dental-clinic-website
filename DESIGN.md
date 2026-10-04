# Design Sheet: BrightSmile Dental Clinic

## 1. Basic Information
| Item | Decision |
|------|----------|
| Clinic name | BrightSmile Dental Clinic |
| Slogan | Healthy Teeth, Brighter Smiles |
| Audience | Families in the city: parents, children, adults |
| Main goal of the site | Get visitors to book an appointment |
| Tone of writing | Friendly, calm, simple (no medical jargon) |

## 2. Sections (in order)
| # | Section | id | Content |
|---|---------|----|---------|
| 1 | Hero | home | Slogan, short sentence, "Book an Appointment" button |
| 2 | Services | services | 6 services, each with icon, name, one sentence |
| 3 | About & Team | about | Clinic story (2 sentences), 3 dentists |
| 4 | Oral-Care Tips | tips | 5 short tips |
| 5 | Reviews | reviews | 3 patient reviews with stars |
| 6 | FAQ | faq | 4 questions and answers |
| 7 | Appointment | appointment | Booking form and "My Appointments" list |
| 8 | Contact | contact | Address, phone, email, opening hours |

A separate staff page (`admin.html`) lists all bookings. See [STRUCTURE.md](STRUCTURE.md), section 7.

## 3. Colours
| Name | Hex code | Used for |
|------|----------|----------|
| Primary | #1a7ea2 | Buttons, logo, links (trust and cleanliness) |
| Primary dark | #156f8f | Headings, button hover, hero gradient start |
| Accent | #e9f6fb | Light blue section backgrounds |
| Text | #24323d | Main text, footer background |
| Muted | #5f7180 | Secondary text |
| Error | #d43d3d | Form error messages |
| Success | #27844c | Booking confirmation message |
| Star | #cc8309 | Review stars |
| Focus | #c2410c | Keyboard focus outline (orange, so it stands out from the blues) |

Why blue? Blue is linked with health, calm, and cleanliness, which suits a dental clinic.

**Readability rule:** every text colour has a contrast of at least **4.5:1** with its background
(the WCAG accessibility standard). Phase 3 darkened Primary, Error, Success, and Star slightly
because the original shades were below this. Test any new colour at https://webaim.org/resources/contrastchecker/

## 4. Typography
| Item | Decision |
|------|----------|
| Heading font | Poppins 600/700 (free, from Google Fonts) |
| Body font | The device's own font: system-ui (Segoe UI on Windows, Roboto on Android, San Francisco on Apple) |
| Main heading | 3rem (2.2rem on phones) |
| Section headings | 2rem |
| Body text | 1rem, line height 1.6 |

## 5. Services Content
| Service | Description |
|---------|-------------|
| Check-ups | Regular exams to catch problems early. |
| Cleaning | Remove plaque and tartar for healthy gums. |
| Fillings | Tooth-coloured fillings to repair cavities. |
| Whitening | Safe treatments for a brighter smile. |
| Braces | Straighten teeth with braces or aligners. |
| Root Canal | Save infected teeth and relieve pain. |

## 6. Opening Hours (also used by the booking rules)
| Day | Hours |
|-----|-------|
| Mon – Fri | 9:00 – 18:00 |
| Saturday | 9:00 – 13:00 |
| Sunday | Closed |

## 7. Rough Layout Sketch (desktop)
```
+--------------------------------------------------+
| LOGO           Services About Tips FAQ [Book]    |
+--------------------------------------------------+
|          HEALTHY TEETH, BRIGHTER SMILES          |
|              [ Book an Appointment ]             |
+--------------------------------------------------+
|  [card]   [card]   [card]                        |
|  [card]   [card]   [card]      ← Services        |
+--------------------------------------------------+
|  ... About, Tips, Reviews, FAQ ...               |
+--------------------------------------------------+
|  [ Booking form ]                                |
|  My Appointments list                            |
+--------------------------------------------------+
|  Contact info        |  Opening hours table      |
+--------------------------------------------------+
|  Footer  ·  Clinic staff area link               |
+--------------------------------------------------+
```
On phones: cards stack in 1 column, and the menu becomes a ☰ button.
