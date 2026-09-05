// weather logic

const city = document.querySelector("#city");
const temperature = document.querySelector("#temperature");
const condition = document.querySelector("#condition");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const icon = document.querySelector("#icon");
const feelsLike = document.querySelector("#feels-like");

const weatherApiKey = "abedbadf4af9b3b8c1817ae66d1c237f";
const defaultWeatherUrl =
  `https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=${weatherApiKey}&units=metric`;

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
    let weatherUrl = defaultWeatherUrl;

    if (navigator.geolocation) {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;
      weatherUrl =
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`;
    }

    const response = await fetch(weatherUrl);
    if (!response.ok) throw new Error("Weather request failed");

    const data = await response.json();

    if (city) city.textContent = `📍 ${data.name}, ${data.sys.country}`;
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
const menuBtn = document.getElementById("menuBtn");
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
addTaskBtn.addEventListener("click", () => {
  addTask();
});

// Enter Key Support
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Add Task Function
function addTask(taskText = null, completed = false) {

  const text = taskText || taskInput.value.trim();

  if (text === "") return;

  const li = document.createElement("li");

  li.classList.add("task-item");

  const taskLeft = document.createElement("div");
  taskLeft.className = "task-left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "complete-checkbox";
  checkbox.checked = completed;

  const taskSpan = document.createElement("span");
  taskSpan.className = `task-text ${completed ? "completed" : ""}`;
  taskSpan.textContent = text;

  const taskActions = document.createElement("div");
  taskActions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.type = "button";
  editBtn.textContent = "Edit";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "cancel-edit-btn";
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancel";
  cancelBtn.hidden = true;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";

  taskLeft.append(checkbox, taskSpan);
  taskActions.append(editBtn, cancelBtn, deleteBtn);
  li.append(taskLeft, taskActions);

  taskList.appendChild(li);

  taskInput.value = "";

  // Complete Task
  checkbox.addEventListener("change", () => {
    taskSpan.classList.toggle("completed");
    saveTasks();
  });

  // Delete Task
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  // Edit Task
  editBtn.addEventListener("click", () => {
    if (editBtn.dataset.editing === "true") {
      const updatedTask = taskSpan.querySelector("input").value.trim();

      if (!updatedTask) return;

      taskSpan.textContent = updatedTask;
      editBtn.textContent = "Edit";
      editBtn.dataset.editing = "false";
      cancelBtn.hidden = true;
      saveTasks();
      return;
    }

    const editInput = document.createElement("input");
    editInput.className = "task-edit-input";
    editInput.type = "text";
    editInput.value = taskSpan.textContent;
    taskSpan.textContent = "";
    taskSpan.appendChild(editInput);
    editBtn.textContent = "Save";
    editBtn.dataset.editing = "true";
    cancelBtn.hidden = false;
    editInput.focus();
    editInput.select();

    editInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") editBtn.click();
      if (event.key === "Escape") cancelBtn.click();
    });
  });

  cancelBtn.addEventListener("click", () => {
    const editInput = taskSpan.querySelector("input");

    if (!editInput) return;

    taskSpan.textContent = editInput.defaultValue;
    editBtn.textContent = "Edit";
    editBtn.dataset.editing = "false";
    cancelBtn.hidden = true;
  });

  saveTasks();
  taskList.dispatchEvent(
    new CustomEvent("noteadded", {
      detail: { text, completed, element: li },
    }),
  );
}

// Save Tasks to Local Storage
function saveTasks() {

  const tasks = [];

  document.querySelectorAll(".task-item").forEach((task) => {

    tasks.push({
      text: task.querySelector(".task-text").textContent.trim(),
      completed: task.querySelector(".complete-checkbox").checked
    });

  });

  localStorage.setItem(
    "todoTasks",
    JSON.stringify(tasks)
  );
}

// Load Tasks from Local Storage
function loadTasks() {

  const savedTasks =
    JSON.parse(localStorage.getItem("todoTasks")) || [];

  savedTasks.forEach((task) => {
    addTask(task.text, task.completed);
  });
}

// Load Tasks on Page Refresh
window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
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


// goals logic

const goalsBtn = document.getElementById("goalsBtn");
const goalsPage = document.getElementById("goalsPage");
const goalsBackBtn = document.getElementById("goalsBackBtn");

const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalList = document.getElementById("goalList");
const GOALS_STORAGE_KEY = "dashboardGoals";

goalsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  goalsPage.style.display = "block";
});

goalsBackBtn.addEventListener("click", () => {
  goalsPage.style.display = "none";
});

addGoalBtn.addEventListener("click", () => addGoal());

goalInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addGoal();
});

function addGoal(goalText = goalInput.value.trim(), completed = false) {

  if (!goalText) return;

  const li = document.createElement("li");

  li.classList.add("goal-item");

  const goalSpan = document.createElement("span");
  goalSpan.className = `goal-text ${completed ? "completed" : ""}`;
  goalSpan.textContent = goalText;

  const goalActions = document.createElement("div");
  goalActions.className = "goal-actions";

  const completeGoalBtn = document.createElement("button");
  completeGoalBtn.className = "complete-goal";
  completeGoalBtn.textContent = "Complete";

  const editGoalBtn = document.createElement("button");
  editGoalBtn.className = "edit-goal";
  editGoalBtn.textContent = "Edit";

  const cancelGoalBtn = document.createElement("button");
  cancelGoalBtn.className = "cancel-goal";
  cancelGoalBtn.textContent = "Cancel";
  cancelGoalBtn.hidden = true;

  const deleteGoalBtn = document.createElement("button");
  deleteGoalBtn.className = "delete-goal";
  deleteGoalBtn.textContent = "Delete";

  goalActions.append(completeGoalBtn, editGoalBtn, cancelGoalBtn, deleteGoalBtn);
  li.append(goalSpan, goalActions);

  goalList.appendChild(li);

  goalInput.value = "";

  completeGoalBtn.addEventListener("click", () => {
    goalSpan.classList.toggle("completed");
    saveGoals();
  });

  deleteGoalBtn.addEventListener("click", () => {
    li.remove();
    saveGoals();
  });

  editGoalBtn.addEventListener("click", () => {
    if (editGoalBtn.dataset.editing === "true") {
      const updatedGoal = goalSpan.querySelector("input").value.trim();

      if (!updatedGoal) return;

      goalSpan.textContent = updatedGoal;
      editGoalBtn.textContent = "Edit";
      editGoalBtn.dataset.editing = "false";
      cancelGoalBtn.hidden = true;
      saveGoals();
      return;
    }

    const goalInputEditor = document.createElement("input");
    goalInputEditor.className = "goal-edit-input";
    goalInputEditor.type = "text";
    goalInputEditor.value = goalSpan.textContent;
    goalSpan.textContent = "";
    goalSpan.appendChild(goalInputEditor);
    editGoalBtn.textContent = "Save";
    editGoalBtn.dataset.editing = "true";
    cancelGoalBtn.hidden = false;
    goalInputEditor.focus();
    goalInputEditor.select();
  });

  cancelGoalBtn.addEventListener("click", () => {
    const goalInputEditor = goalSpan.querySelector("input");

    if (!goalInputEditor) return;

    goalSpan.textContent = goalInputEditor.defaultValue;
    editGoalBtn.textContent = "Edit";
    editGoalBtn.dataset.editing = "false";
    cancelGoalBtn.hidden = true;
  });

  goalInput.value = "";
  saveGoals();
}

function saveGoals() {
  const goals = [...goalList.querySelectorAll(".goal-item")].map((goal) => ({
    text: goal.querySelector(".goal-text").textContent.trim(),
    completed: goal.querySelector(".goal-text").classList.contains("completed"),
  }));

  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
}

function loadGoals() {
  const savedGoals = JSON.parse(localStorage.getItem(GOALS_STORAGE_KEY)) || [];

  savedGoals.forEach((goal) => addGoal(goal.text, goal.completed));
}

loadGoals();

//motivation logic

const motivationPage = document.getElementById("motivationPage");

const motivationBackBtn = document.getElementById("motivationBackBtn");

const motivationQuote = document.getElementById("motivationQuote");

const motivationAuthor = document.getElementById("motivationAuthor");

const newQuoteBtn = document.getElementById("newQuoteBtn");
const manualQuoteInput = document.getElementById("manualQuoteInput");
const manualAuthorInput = document.getElementById("manualAuthorInput");
const saveQuoteBtn = document.getElementById("saveQuoteBtn");

motivationBtn.addEventListener("click", (e) => {
  e.preventDefault();

  motivationPage.style.display = "block";

  loadMotivationQuote();
});

motivationBackBtn.addEventListener("click", () => {
  motivationPage.style.display = "none";
});

newQuoteBtn.addEventListener("click", () => {
  loadMotivationQuote(true);
});

saveQuoteBtn.addEventListener("click", () => {
  const manualText = manualQuoteInput.value.trim();

  if (!manualText) return;

  const savedQuote = {
    quote: manualText,
    author: manualAuthorInput.value.trim(),
  };

  localStorage.setItem("manualQuote", JSON.stringify(savedQuote));
  motivationQuote.textContent = savedQuote.quote;
  motivationAuthor.textContent = savedQuote.author
    ? `— ${savedQuote.author}`
    : "";
  manualQuoteInput.value = "";
  manualAuthorInput.value = "";
});

async function loadMotivationQuote(forceNew = false) {
  const savedQuote = JSON.parse(localStorage.getItem("manualQuote"));

  if (!forceNew && savedQuote?.quote) {
    motivationQuote.textContent = savedQuote.quote;
    motivationAuthor.textContent = savedQuote.author
      ? `— ${savedQuote.author}`
      : "";
    return;
  }

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

// ===============================
// DAILY PLANNER
// ===============================

const dailyPlanBtn = document.getElementById("dailyPlanBtn");
const plannerPage = document.getElementById("plannerPage");
const plannerBackBtn = document.getElementById("plannerBackBtn");

const plannerHour = document.getElementById("plannerHour");
const plannerMinute = document.getElementById("plannerMinute");
const plannerPeriod = document.getElementById("plannerPeriod");

const plannerTask = document.getElementById("plannerTask");
const addPlanBtn = document.getElementById("addPlanBtn");
const plannerList = document.getElementById("plannerList");

// Open Planner
dailyPlanBtn.addEventListener("click", (e) => {
  e.preventDefault();
  plannerPage.style.display = "block";
});

// Back Button
plannerBackBtn.addEventListener("click", () => {
  plannerPage.style.display = "none";
});

// Add Plan Button
addPlanBtn.addEventListener("click", addPlan);

// Enter Key Support
plannerTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addPlan();
  }
});

// Add New Plan
function addPlan() {
  const hour = plannerHour.value.trim();
  const minute = plannerMinute.value.trim();
  const period = plannerPeriod.value;
  const task = plannerTask.value.trim();

  if (hour === "" || minute === "" || task === "") {
    return;
  }

  const formattedTime =
    `${hour}:${minute.padStart(2, "0")} ${period}`;

  createPlan(formattedTime, task, false);

  plannerHour.value = "";
  plannerMinute.value = "";
  plannerPeriod.value = "AM";
  plannerTask.value = "";

  savePlans();
}

// Create Plan Card
function createPlan(time, task, completed = false) {

  const plan = document.createElement("div");

  plan.classList.add("plan-card");

  const planLeft = document.createElement("div");
  planLeft.className = "plan-left";

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "plan-check";
  check.checked = completed;

  const timeSpan = document.createElement("span");
  timeSpan.className = "plan-time";
  timeSpan.textContent = time;

  const text = document.createElement("span");
  text.className = `plan-text ${completed ? "completed" : ""}`;
  text.textContent = task;

  const planActions = document.createElement("div");
  planActions.className = "plan-actions";

  const editPlanBtn = document.createElement("button");
  editPlanBtn.className = "edit-plan";
  editPlanBtn.textContent = "Edit";

  const cancelPlanBtn = document.createElement("button");
  cancelPlanBtn.className = "cancel-plan";
  cancelPlanBtn.textContent = "Cancel";
  cancelPlanBtn.hidden = true;

  const deletePlanBtn = document.createElement("button");
  deletePlanBtn.className = "delete-plan";
  deletePlanBtn.textContent = "Delete";

  planLeft.append(check, timeSpan, text);
  planActions.append(editPlanBtn, cancelPlanBtn, deletePlanBtn);
  plan.append(planLeft, planActions);

  plannerList.appendChild(plan);

  // Complete
  check.addEventListener("change", () => {
    text.classList.toggle("completed");
    savePlans();
  });

  // Delete
  deletePlanBtn.addEventListener("click", () => {
    plan.remove();
    savePlans();
  });

  // Edit
  editPlanBtn.addEventListener("click", () => {
    if (editPlanBtn.dataset.editing === "true") {
      const updated = text.querySelector("input").value.trim();

      if (!updated) return;

      text.textContent = updated;
      editPlanBtn.textContent = "Edit";
      editPlanBtn.dataset.editing = "false";
      cancelPlanBtn.hidden = true;
      savePlans();
      return;
    }

    const planInputEditor = document.createElement("input");
    planInputEditor.className = "plan-edit-input";
    planInputEditor.type = "text";
    planInputEditor.value = text.textContent;
    text.textContent = "";
    text.appendChild(planInputEditor);
    editPlanBtn.textContent = "Save";
    editPlanBtn.dataset.editing = "true";
    cancelPlanBtn.hidden = false;
    planInputEditor.focus();
    planInputEditor.select();
  });

  cancelPlanBtn.addEventListener("click", () => {
    const planInputEditor = text.querySelector("input");

    if (!planInputEditor) return;

    text.textContent = planInputEditor.defaultValue;
    editPlanBtn.textContent = "Edit";
    editPlanBtn.dataset.editing = "false";
    cancelPlanBtn.hidden = true;
  });
}

// Save Plans
function savePlans() {

  const plans = [];

  document.querySelectorAll(".plan-card").forEach((plan) => {

    plans.push({
      time: plan.querySelector(".plan-time").textContent.trim(),
      task: plan.querySelector(".plan-text").textContent.trim(),
      completed: plan.querySelector(".plan-check").checked
    });

  });

  localStorage.setItem(
    "dailyPlans",
    JSON.stringify(plans)
  );
}

// Load Plans
function loadPlans() {

  const savedPlans =
    JSON.parse(
      localStorage.getItem("dailyPlans")
    ) || [];

  savedPlans.forEach((plan) => {

    createPlan(
      plan.time,
      plan.task,
      plan.completed
    );

  });
}

// Load Saved Plans On Refresh
window.addEventListener("DOMContentLoaded", () => {
  loadPlans();
});
