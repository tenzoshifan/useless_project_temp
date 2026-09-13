const KEYS = {
  current: "pawride_currentBooking",
  selected: "pawride_selectedDriver",
  bookings: "pawride_bookings"
};

const DRIVER_POOL = [
  { name: "Sabu", rating: 4.6, rides: 98 },
  { name: "Susheelan", rating: 4.8, rides: 142 },
  { name: "Ashokan", rating: 4.7, rides: 115 }
];

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* Storage may be unavailable in private browsing. */ }
}
function getCurrentBooking() { return readJson(KEYS.current, null); }
function setCurrentBooking(data) { writeJson(KEYS.current, data); }
function getSelectedDriver() { return readJson(KEYS.selected, null); }
function setSelectedDriver(data) { writeJson(KEYS.selected, data); }
function getBookings() { const bookings = readJson(KEYS.bookings, []); return Array.isArray(bookings) ? bookings : []; }
function addBooking(record) { writeJson(KEYS.bookings, [...getBookings(), record]); }
function generateBookingId() { return `PR${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`; }
function getDriversForRide(rideType) {
  const vehicles = {
    "Pet Car": ["Maruti Swift", "Honda Amaze", "Tata Punch"],
    "Pet Van": ["Maruti Eeco", "Force Traveller", "Kia Carnival"],
    "Pet Bike": ["Honda Activa", "TVS Ntorq", "Bajaj Chetak"]
  };
  return DRIVER_POOL.map((driver, index) => ({ ...driver, rideType, vehicle: vehicles[rideType]?.[index] || vehicles["Pet Car"][index] }));
}
function calculateFare(booking) {
  const base = { "Pet Bike": 60, "Pet Car": 90, "Pet Van": 135 }[booking.rideType] || 90;
  const animalMultiplier = { Dog: 1, Elephant: 2.45, Monkey: 1.2, Other: 1 }[booking.animalType] || 1;
  return Math.round((base + 40 + Math.random() * 105) * animalMultiplier);
}
function formatFare(fare) { return `₹${Number(fare).toLocaleString("en-IN")}`; }
function formatDate(date) { if (!date) return ""; return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
function formatTime(time) { if (!time) return ""; return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character])); }

function initNav() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) toggle.addEventListener("click", () => { const open = links.classList.toggle("open"); toggle.setAttribute("aria-expanded", String(open)); });
}

function initBooking() {
  const form = document.querySelector("#booking-form");
  const dateInput = document.querySelector("#date");
  if (!form || !dateInput) return;
  dateInput.min = new Date().toISOString().split("T")[0];
  document.querySelectorAll("[data-animal]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-animal]").forEach(item => item.classList.remove("selected"));
    button.classList.add("selected"); document.querySelector("#animalType").value = button.dataset.animal;
  }));
  document.querySelectorAll("[data-ride]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-ride]").forEach(item => item.classList.remove("selected"));
    button.classList.add("selected"); document.querySelector("#rideType").value = button.dataset.ride;
  }));
  form.addEventListener("submit", event => {
    event.preventDefault();
    document.querySelectorAll(".field-error").forEach(error => { if (error.parentElement?.classList.contains("input-wrap")) error.textContent = ""; });
    const data = { pickup: form.pickup.value.trim(), destination: form.destination.value.trim(), animalType: form.animalType.value, date: form.date.value, time: form.time.value, rideType: form.rideType.value };
    const missing = [];
    [["pickup", data.pickup], ["destination", data.destination], ["date", data.date], ["time", data.time]].forEach(([id, value]) => { if (!value) { const error = document.querySelector(`#${id}`).closest(".input-wrap").querySelector(".field-error"); error.textContent = "Required"; missing.push(id); } });
    if (!data.animalType) { document.querySelector(".animal-grid").previousElementSibling.querySelector(".field-error").textContent = "Choose one"; missing.push("animal"); }
    if (!data.rideType) { document.querySelector(".ride-grid").previousElementSibling.querySelector(".field-error").textContent = "Choose one"; missing.push("ride"); }
    if (missing.length) { document.querySelector("#form-status").textContent = "A few details are still needed."; return; }
    setCurrentBooking(data); window.location.href = "drivers.html";
  });
}

function initDrivers() {
  const target = document.querySelector("#drivers-list");
  if (!target) return;
  const booking = getCurrentBooking();
  if (!booking) { window.location.href = "booking.html"; return; }
  const animalIcon = { Dog: "🐶", Elephant: "🐘", Monkey: "🐒", Other: "🐾" }[booking.animalType] || "🐾";
  const rideIcon = { "Pet Car": "🚗", "Pet Van": "🚐", "Pet Bike": "🏍️" }[booking.rideType] || "🚗";
    const driverImages = ["dog1.jpg", "cow1.jpg", "monkey.jpg"];
    document.querySelector("#trip-summary").innerHTML = `<div class="summary-route"><span>${escapeHtml(booking.pickup)}</span><span class="arrow">→</span><span>${escapeHtml(booking.destination)}</span></div><div class="summary-meta"><span>${animalIcon} ${escapeHtml(booking.animalType)}</span><span>◷ ${formatDate(booking.date)} · ${formatTime(booking.time)}</span><span>${rideIcon} ${escapeHtml(booking.rideType)}</span></div>`;
  getDriversForRide(booking.rideType).forEach((driver, index) => {
    const fare = calculateFare(booking);
    const card = document.createElement("article"); card.className = "driver-card";
    card.innerHTML = `<span class="driver-badge">${index === 0 ? "TOP MATCH" : "AVAILABLE"}</span><div class="driver-top"><img class="driver-avatar driver-photo" src="${driverImages[index]}" alt="${escapeHtml(driver.name)} profile"><div class="driver-info"><h3>${escapeHtml(driver.name)}</h3><p class="rating">★ ${driver.rating} <span>· ${driver.rides} rides</span></p></div></div><div class="vehicle"><span>Vehicle</span><strong>${escapeHtml(driver.vehicle)} · ${escapeHtml(driver.rideType)}</strong></div><div><span class="fare-label">Estimated fare</span><strong class="fare">${formatFare(fare)}</strong></div><button class="btn btn-primary" type="button">Book cheyyu <span>↗</span></button>`;
    card.querySelector("button").addEventListener("click", () => { const selected = { name: driver.name, rating: driver.rating, rides: driver.rides, vehicle: driver.vehicle, rideType: driver.rideType, fare }; setSelectedDriver(selected); addBooking({ bookingId: generateBookingId(), ...booking, driver: driver.name, rating: driver.rating, rides: driver.rides, vehicle: driver.vehicle, fare, status: "Confirmed", createdAt: new Date().toISOString() }); window.location.href = "confirmation.html"; });
    target.appendChild(card);
  });
}

function initConfirmation() {
  const target = document.querySelector("#confirmation-card"); if (!target) return;
  const booking = getBookings().at(-1); if (!booking) { window.location.href = "booking.html"; return; }
  const rows = [["Booking ID", booking.bookingId], ["Driver", `${booking.driver} · ★ ${booking.rating}`], ["Passenger", booking.animalType], ["Pickup", booking.pickup], ["Destination", booking.destination], ["Date & time", `${formatDate(booking.date)} · ${formatTime(booking.time)}`], ["Ride type", booking.rideType], ["Estimated fare", formatFare(booking.fare), "fare-value"]];
  target.innerHTML = rows.map(([label, value, className = ""]) => `<dl class="detail-row"><dt>${label}</dt><dd class="${className}">${escapeHtml(value)}</dd></dl>`).join("");
}

function initBookings() {
  const target = document.querySelector("#bookings-list"); if (!target) return;
  const bookings = getBookings().reverse();
  if (!bookings.length) { target.innerHTML = `<div class="empty-state"><div class="empty-paw">🐾</div><h2>No rides booked yet</h2><p>Your next adventure is only a few clicks away.</p><a class="btn btn-primary" href="booking.html">Book a ride <span>↗</span></a></div>`; return; }
  target.innerHTML = bookings.map(booking => `<article class="booking-card"><div><span class="booking-id">${escapeHtml(booking.bookingId)}</span><h3>${escapeHtml(booking.driver)}</h3><span class="booking-date">${formatDate(booking.date)} · ${formatTime(booking.time)}</span></div><div class="booking-route"><strong>${escapeHtml(booking.animalType)} ${booking.animalType === "Dog" ? "🐶" : booking.animalType === "Elephant" ? "🐘" : booking.animalType === "Monkey" ? "🐒" : "🐾"}</strong><span>${escapeHtml(booking.pickup)} <b class="arrow">→</b> ${escapeHtml(booking.destination)}</span><span>${escapeHtml(booking.vehicle)} · ${escapeHtml(booking.rideType)}</span></div><div class="booking-fare"><strong>${formatFare(booking.fare)}</strong><span class="status-badge">${escapeHtml(booking.status)}</span></div></article>`).join("");
}

document.addEventListener("DOMContentLoaded", () => { initNav(); initBooking(); initDrivers(); initConfirmation(); initBookings(); });
