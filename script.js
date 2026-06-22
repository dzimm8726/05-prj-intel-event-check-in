// ===== Intel Sustainability Summit Check-In =====

// Config
const MAX_ATTENDEES = 50;

// Team label lookup (used for greetings and the attendee list)
const TEAM_LABELS = {
  water: "🌊 Team Water Wise",
  zero: "🌿 Team Net Zero",
  power: "⚡ Team Renewables",
};

// ===== Grab DOM elements =====
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCountEl = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const waterCountEl = document.getElementById("waterCount");
const zeroCountEl = document.getElementById("zeroCount");
const powerCountEl = document.getElementById("powerCount");

// ===== App state =====
// LevelUp: load saved data from localStorage, or start fresh
let totalCount = 0;
let teamCounts = { water: 0, zero: 0, power: 0 };
let attendees = []; // { name, team }

function loadProgress() {
  const saved = localStorage.getItem("intelSummitData");
  if (saved) {
    const data = JSON.parse(saved);
    totalCount = data.totalCount || 0;
    teamCounts = data.teamCounts || { water: 0, zero: 0, power: 0 };
    attendees = data.attendees || [];
  }
}

function saveProgress() {
  const data = { totalCount, teamCounts, attendees };
  localStorage.setItem("intelSummitData", JSON.stringify(data));
}

// ===== UI update functions =====
function updateCountDisplay() {
  attendeeCountEl.textContent = totalCount;
}

function updateTeamDisplay() {
  waterCountEl.textContent = teamCounts.water;
  zeroCountEl.textContent = teamCounts.zero;
  powerCountEl.textContent = teamCounts.power;
}

function updateProgressBar() {
  const percentage = (totalCount / MAX_ATTENDEES) * 100;
  progressBar.style.width = percentage + "%";
}

// LevelUp: render the list of attendees beneath the team counters
function renderAttendeeList() {
  let listSection = document.getElementById("attendeeListSection");

  // Build the section once if it doesn't exist yet
  if (!listSection) {
    listSection = document.createElement("div");
    listSection.id = "attendeeListSection";
    listSection.className = "attendee-list";
    listSection.innerHTML = `<h3>Checked-In Attendees</h3><ul id="attendeeListItems"></ul>`;
    document.querySelector(".team-stats").appendChild(listSection);
  }

  const items = document.getElementById("attendeeListItems");
  items.innerHTML = "";

  attendees.forEach((person) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${person.name}</span><span class="attendee-team">${TEAM_LABELS[person.team]}</span>`;
    items.appendChild(li);
  });
}

// LevelUp: when goal is reached, show the winning team
function checkForCelebration() {
  if (totalCount >= MAX_ATTENDEES) {
    // Find the team with the highest count
    let winningTeam = "water";
    if (teamCounts.zero > teamCounts[winningTeam]) winningTeam = "zero";
    if (teamCounts.power > teamCounts[winningTeam]) winningTeam = "power";

    greeting.textContent =
      `🎉 Attendance goal reached! Congratulations to ${TEAM_LABELS[winningTeam]} ` +
      `for the highest turnout with ${teamCounts[winningTeam]} attendees! 🎉`;
    greeting.classList.add("success-message");
    greeting.style.display = "block";
    return true;
  }
  return false;
}

// ===== Form submission =====
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  // Get values from the input and dropdown
  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) return; // safety check

  // Increment totals
  totalCount++;
  teamCounts[team]++;
  attendees.push({ name, team });

  // Update everything on the page
  updateCountDisplay();
  updateTeamDisplay();
  updateProgressBar();
  renderAttendeeList();

  // Save progress (LevelUp)
  saveProgress();

  // Show greeting — celebration takes over if goal is reached
  if (!checkForCelebration()) {
    greeting.textContent = `Welcome, ${name}! You've checked in with ${TEAM_LABELS[team]}.`;
    greeting.classList.add("success-message");
    greeting.style.display = "block";
  }

  // Reset the form for the next attendee
  form.reset();
  nameInput.focus();
});

// ===== Initialize on page load =====
loadProgress();
updateCountDisplay();
updateTeamDisplay();
updateProgressBar();
renderAttendeeList();
checkForCelebration();
