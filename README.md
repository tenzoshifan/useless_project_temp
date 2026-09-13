# PawRide - Uber for Animals

PawRide is a playful static hackathon demo for booking animal-friendly rides. Pet parents can plan a route, choose a dog, elephant, monkey, or other passenger, compare Sabu, Susheelan, and Ashokan, and keep a local booking history.

## The idea

ഓരോ ജീവനും സുരക്ഷിത യാത്ര. PawRide turns the trip into a funny, friendly flow: tell us where to go, meet a driver match, and ride easy.

## Technical details

- HTML, CSS, and vanilla JavaScript
- Responsive multi-page static site
- Browser `localStorage` for simulated app state
- Malayalam-capable `Manjari` and `Noto Sans Malayalam` web fonts
- Blue, sky-blue, and yellow playful visual system
- No build step, backend, or real APIs

## Run locally

No installation is required. Open `index.html` in a browser, or serve the folder with any static file server.

Follow this flow to demo the app:

`Home -> Book a ride -> choose a driver -> confirmation -> My bookings`

The shared state keys are `pawride_currentBooking`, `pawride_selectedDriver`, and `pawride_bookings`.

Main demo labels are intentionally playful: `appo povalle?`, `aare venam?`, and `Book cheyyu`.

## Project files

- `index.html` - home and product introduction
- `booking.html` - route, animal, date, time, and vehicle form
- `drivers.html` - simulated driver matches and fares
- `confirmation.html` - confirmed trip details
- `mybookings.html` - local booking history
- `style.css` - shared responsive visual system
- `script.js` - navigation, validation, fake data, and localStorage flow

## Demo notes

All fares, drivers, ratings, and route handling are simulated for a hackathon presentation. No real tracking, payments, or driver services are connected.

Made with care at TinkerHub Useless Projects.
