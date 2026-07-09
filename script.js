// weather logic

const city = document.querySelector("#city");
const temperature = document.querySelector("#temperature");
const condition = document.querySelector("#condition");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const icon = document.querySelector("#icon");
const feelsLike = document.querySelector("#feels-like");

const url =
  "https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=abedbadf4af9b3b8c1817ae66d1c237f&units=metric";

function getWeatherIcon(main) {
  switch (main.toLowerCase()) {
    case "clear":
      return "☀️";
    case "clouds":
      return "☁️";
    case "rain":
      return "🌧️";
    case "snow":
      return "❄️";
    case "thunderstorm":
      return "⛈️";
    default:
      return "🌤️";
  }
}

async function getWeather() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather request failed");

    const data = await response.json();

    if (city)
      city.innerHTML = `<span class="geo-icon">📍</span> ${data.name}, India `;
    if (temperature)
      temperature.textContent = `${Math.round(data.main.temp)}°C`;
    if (condition) condition.textContent = data.weather[0].main;
    if (humidity) humidity.textContent = `${data.main.humidity}%`;
    if (wind) wind.textContent = `${data.wind.speed} km/h`;
    if (feelsLike)
      feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    if (icon) icon.textContent = getWeatherIcon(data.weather[0].main);
  } catch (error) {
    if (condition) condition.textContent = "Weather unavailable";
    if (icon) icon.textContent = "☁️";
  }
}

// quote logic

const quote = document.querySelector("#quote");
const author = document.querySelector("#author");
const mainContent = document.querySelector(".main-content");
const clock = document.querySelector("#clock");
const dateEl = document.querySelector("#date");
const body = document.body;
const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector("#themeIcon");
const themeText = document.querySelector("#themeText");
const backgroundVideo = document.querySelector("#backgroundVideo");

const quoteUrl = "https://motivational-spark-api.vercel.app/api/quotes";

function getThemeByHour(hour) {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

function getVideoForTheme(theme) {
  const mode = body.getAttribute("data-theme-mode") || "dark";
  if (mode === "light") return "./assets/Sunrise.mp4";
  return theme === "night" ? "./assets/Night.mp4" : "./assets/Sunrise.mp4";
}

function updateBackgroundVideo() {
  const theme = body.getAttribute("data-theme") || "morning";

  if (backgroundVideo) {
    const source = backgroundVideo.querySelector("source");
    if (source) {
      source.setAttribute("src", getVideoForTheme(theme));
      backgroundVideo.load();
    }
  }
}

function applyTimeTheme() {
  const hour = new Date().getHours();
  const theme = getThemeByHour(hour);

  if (mainContent) {
    mainContent.classList.remove("morning", "afternoon", "evening", "night");
    mainContent.classList.add(theme);
  }

  if (body) {
    body.setAttribute("data-theme", theme);
  }

  updateBackgroundVideo();
}

function updateClock() {
  const now = new Date();
  if (clock) {
    clock.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }
}

function updateThemeToggleUI() {
  const mode = body.getAttribute("data-theme-mode") || "dark";

  if (themeIcon) {
    themeIcon.textContent = mode === "light" ? "☀️" : "🌙";
  }

  if (themeText) {
    themeText.textContent = mode === "light" ? "Light" : "Dark";
  }

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      mode === "light" ? "Switch to dark mode" : "Switch to light mode",
    );
  }
}

function toggleThemeMode() {
  const currentMode = body.getAttribute("data-theme-mode") || "dark";
  const nextMode = currentMode === "light" ? "dark" : "light";

  body.setAttribute("data-theme-mode", nextMode);
  localStorage.setItem("dashboard-theme-mode", nextMode);
  updateThemeToggleUI();
  updateBackgroundVideo();
}

async function getQuote() {
  try {
    const response = await fetch(quoteUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch quote");
    }

    const data = await response.json();
    const quotes = Array.isArray(data) ? data : [data];
    const pickedQuote = quotes[Math.floor(Math.random() * quotes.length)] || {};

    if (quote) {
      quote.textContent = pickedQuote.quote || "Unable to load quote.";
    }

    if (author) {
      author.textContent = pickedQuote.author ? `— ${pickedQuote.author}` : "";
    }
  } catch (error) {
    console.error(error);
    if (quote) quote.textContent = "Unable to load quote.";
    if (author) author.textContent = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedThemeMode = localStorage.getItem("dashboard-theme-mode");
  const initialMode = savedThemeMode === "light" ? "light" : "dark";

  body.setAttribute("data-theme-mode", initialMode);

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleThemeMode);
  }

  getWeather();
  getQuote();
  applyTimeTheme();
  updateClock();
  updateThemeToggleUI();
  setInterval(updateClock, 1000);
});

// responsive
const menuBtn = document.getElementById("#menuBtn");
const sidebar = document.querySelector(".sidebar");

window.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.querySelector(".sidebar");

  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
});

const todoBtn = document.querySelector("#todoBtn");
const todoPage = document.getElementById("todoPage");
const backBtn = document.getElementById("backBtn");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Open Todo Page
todoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  todoPage.style.display = "block";
});

// Back to Dashboard
backBtn.addEventListener("click", () => {
  todoPage.style.display = "none";
});

// Add Task Button
addTaskBtn.addEventListener("click", addTask);

// Function
function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  const li = document.createElement("li");

  li.classList.add("task-item");

  li.innerHTML = `
        <div class="task-left">
            <input type="checkbox" class="complete-checkbox">
            <span class="task-text">${taskText}</span>
        </div>

        <div class="task-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

  taskList.appendChild(li);

  taskInput.value = "";

  // Complete
  const checkbox = li.querySelector(".complete-checkbox");
  const taskSpan = li.querySelector(".task-text");

  checkbox.addEventListener("change", () => {
    taskSpan.classList.toggle("completed");
  });

  // Delete
  const deleteBtn = li.querySelector(".delete-btn");

  deleteBtn.addEventListener("click", () => {
    li.remove();
  });

  // Edit
  const editBtn = li.querySelector(".edit-btn");

  editBtn.addEventListener("click", () => {
    const updatedTask = prompt("Edit Task", taskSpan.textContent);

    if (updatedTask && updatedTask.trim() !== "") {
      taskSpan.textContent = updatedTask;
    }
  });
}

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// pomodoro logic

const timerBtn = document.getElementById("timerBtn");
const pomodoroPage = document.getElementById("pomodoroPage");
const timerBackBtn = document.getElementById("timerBackBtn");

const timerDisplay = document.getElementById("timerDisplay");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const sessions = document.querySelectorAll(".session");

const completedSessions = document.getElementById("completedSessions");

const focusMinutes = document.getElementById("focusMinutes");

// Open Pomodoro Page
timerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  pomodoroPage.style.display = "block";
});

// Back Button
timerBackBtn.addEventListener("click", () => {
  pomodoroPage.style.display = "none";
});

let timer = null;

let totalTime = 25 * 60;
let timeLeft = totalTime;

let completed = 0;
let focused = 0;

// Update Timer Display
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Session Switch
sessions.forEach((btn) => {
  btn.addEventListener("click", () => {
    sessions.forEach((item) => item.classList.remove("active"));

    btn.classList.add("active");

    clearInterval(timer);
    timer = null;

    const sessionType = btn.textContent.trim();

    if (sessionType === "Focus") {
      totalTime = 25 * 60;
    }

    if (sessionType === "Break") {
      totalTime = 5 * 60;
    }

    if (sessionType === "Long Break") {
      totalTime = 15 * 60;
    }

    timeLeft = totalTime;

    updateDisplay();
  });
});

// Start Timer
startBtn.addEventListener("click", () => {
  if (timer) return;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;

      updateDisplay();
    } else {
      clearInterval(timer);
      timer = null;

      const activeSession = document
        .querySelector(".session.active")
        .textContent.trim();

      if (activeSession === "Focus") {
        completed++;

        focused += 25;

        completedSessions.textContent = completed;

        focusMinutes.textContent = focused + "m";
      }

      alert("Pomodoro Complete 🍅");
    }
  }, 1000);
});

// Pause
pauseBtn.addEventListener("click", () => {
  clearInterval(timer);

  timer = null;
});

// Reset
resetBtn.addEventListener("click", () => {
  clearInterval(timer);

  timer = null;

  timeLeft = totalTime;

  updateDisplay();
});

// Initial Display
updateDisplay();

const goalsBtn = document.getElementById("goalsBtn");
const goalsPage = document.getElementById("goalsPage");
const goalsBackBtn = document.getElementById("goalsBackBtn");

const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalList = document.getElementById("goalList");

goalsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  goalsPage.style.display = "block";
});

goalsBackBtn.addEventListener("click", () => {
  goalsPage.style.display = "none";
});

addGoalBtn.addEventListener("click", () => {
  const goalText = goalInput.value.trim();

  if (!goalText) return;

  const li = document.createElement("li");

  li.classList.add("goal-item");

  li.innerHTML = `
    <span class="goal-text">${goalText}</span>

    <div class="goal-actions">

      <button class="complete-goal">
        Complete
      </button>

      <button class="edit-goal">
        Edit
      </button>

      <button class="delete-goal">
        Delete
      </button>

    </div>
  `;

  goalList.appendChild(li);

  goalInput.value = "";

  const goalSpan = li.querySelector(".goal-text");

  li.querySelector(".complete-goal").addEventListener("click", () => {
    goalSpan.classList.toggle("completed");
  });

  li.querySelector(".delete-goal").addEventListener("click", () => {
    li.remove();
  });

  li.querySelector(".edit-goal").addEventListener("click", () => {
    const updatedGoal = prompt("Edit Goal", goalSpan.textContent);

    if (updatedGoal) {
      goalSpan.textContent = updatedGoal;
    }
  });
});

//motivation logic

const motivationPage = document.getElementById("motivationPage");

const motivationBackBtn = document.getElementById("motivationBackBtn");

const motivationQuote = document.getElementById("motivationQuote");

const motivationAuthor = document.getElementById("motivationAuthor");

const newQuoteBtn = document.getElementById("newQuoteBtn");

motivationBtn.addEventListener("click", (e) => {
  e.preventDefault();

  motivationPage.style.display = "block";

  loadMotivationQuote();
});

motivationBackBtn.addEventListener("click", () => {
  motivationPage.style.display = "none";
});

newQuoteBtn.addEventListener("click", () => {
  loadMotivationQuote();
});

async function loadMotivationQuote() {
  try {
    const response = await fetch(
      "https://motivational-spark-api.vercel.app/api/quotes",
    );

    const data = await response.json();

    const randomQuote = data[Math.floor(Math.random() * data.length)];

    motivationQuote.textContent = randomQuote.quote;

    motivationAuthor.textContent = "— " + randomQuote.author;
  } catch (error) {
    motivationQuote.textContent =
      "Believe in yourself. Great things take time.";

    motivationAuthor.textContent = "— Motivation";
  }
}

// daily planner

const dailyPlanBtn = document.getElementById("dailyPlanBtn");
const plannerPage = document.getElementById("plannerPage");
const plannerBackBtn = document.getElementById("plannerBackBtn");

const plannerHour = document.getElementById("plannerHour");
const plannerMinute = document.getElementById("plannerMinute");
const plannerPeriod = document.getElementById("plannerPeriod");

const plannerTask = document.getElementById("plannerTask");
const addPlanBtn = document.getElementById("addPlanBtn");
const plannerList = document.getElementById("plannerList");


// Open Planner Page
dailyPlanBtn.addEventListener("click", (e) => {
    e.preventDefault();

    plannerPage.style.display = "block";
});


// Back Button
plannerBackBtn.addEventListener("click", () => {
    plannerPage.style.display = "none";
});


// Add Plan
addPlanBtn.addEventListener("click", addPlan);

function addPlan() {

    const hour = plannerHour.value.trim();
    const minute = plannerMinute.value.trim();
    const period = plannerPeriod.value;

    const task = plannerTask.value.trim();

    if (
        hour === "" ||
        minute === "" ||
        task === ""
    ) {
        return;
    }

    const formattedTime =
        `${hour}:${minute.padStart(2, "0")} ${period}`;

    const plan = document.createElement("div");

    plan.classList.add("plan-card");

    plan.innerHTML = `
    
        <div class="plan-left">

            <input
                type="checkbox"
                class="plan-check"
            >

            <span class="plan-time">
                ${formattedTime}
            </span>

            <span class="plan-text">
                ${task}
            </span>

        </div>

        <div class="plan-actions">

            <button class="edit-plan">
                Edit
            </button>

            <button class="delete-plan">
                Delete
            </button>

        </div>

    `;

    plannerList.appendChild(plan);

    plannerHour.value = "";
    plannerMinute.value = "";
    plannerPeriod.value = "AM";
    plannerTask.value = "";

    const check = plan.querySelector(".plan-check");
    const text = plan.querySelector(".plan-text");

    // Complete Plan
    check.addEventListener("change", () => {
        text.classList.toggle("completed");
    });

    // Delete Plan
    const deleteBtn = plan.querySelector(".delete-plan");

    deleteBtn.addEventListener("click", () => {
        plan.remove();
    });

    // Edit Plan
    const editBtn = plan.querySelector(".edit-plan");

    editBtn.addEventListener("click", () => {

        const updated = prompt(
            "Edit Plan",
            text.textContent
        );

        if (
            updated !== null &&
            updated.trim() !== ""
        ) {
            text.textContent = updated;
        }

    });

}


// Add with Enter Key
plannerTask.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        addPlan();
    }

});


