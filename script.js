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
