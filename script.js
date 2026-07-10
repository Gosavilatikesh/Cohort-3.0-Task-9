// ======================================
// PRODUCTIVITY DASHBOARD
// PART 1
// Global Variables + Weather + Theme +
// Clock + Quotes + Sidebar
// ======================================

// --------------------
// DOM Elements
// --------------------

const body = document.body;
const mainContent = document.querySelector(".main-content");

const backgroundVideo = document.getElementById("backgroundVideo");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

// Weather

const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feels-like");
const icon = document.getElementById("icon");

// Clock

const clock = document.getElementById("clock");
const dateEl = document.getElementById("date");

// Quotes

const quote = document.getElementById("quote");
const author = document.getElementById("author");

// Sidebar

const sidebar = document.querySelector(".sidebar");
const menuBtn = document.getElementById("menuBtn");

// --------------------
// API URLs
// --------------------

const WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=abedbadf4af9b3b8c1817ae66d1c237f&units=metric";

const QUOTE_URL =
  "https://motivational-spark-api.vercel.app/api/quotes";

// ======================================
// WEATHER
// ======================================

function getWeatherIcon(type) {

  switch (type.toLowerCase()) {

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

async function loadWeather() {

  try {

    const response = await fetch(WEATHER_URL);

    if (!response.ok) {
      throw new Error("Weather Error");
    }

    const data = await response.json();

    city.innerHTML = `📍 ${data.name}, India`;

    temperature.textContent = `${Math.round(data.main.temp)}°C`;

    condition.textContent = data.weather[0].main;

    humidity.textContent = `${data.main.humidity}%`;

    wind.textContent = `${data.wind.speed} km/h`;

    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

    icon.textContent = getWeatherIcon(data.weather[0].main);

  }

  catch (error) {

    condition.textContent = "Weather unavailable";

    icon.textContent = "☁️";

    console.log(error);

  }

}

// ======================================
// CLOCK
// ======================================

function updateClock() {

  const now = new Date();

  clock.textContent = now.toLocaleTimeString([], {

    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true

  });

  dateEl.textContent = now.toLocaleDateString([], {

    weekday: "long",
    month: "long",
    day: "numeric"

  });

}

// ======================================
// TIME THEME
// ======================================

function getThemeByHour(hour) {

  if (hour >= 5 && hour < 12) {

    return "morning";
  }

  if (hour >= 12 && hour < 17) {

    return "afternoon";
  }

  if (hour >= 17 && hour < 20) {

    return "evening";
  }

  return "night";

}

function getVideo(theme) {

  const mode = body.dataset.themeMode;

  if (mode === "light") {

    return "./assets/Sunrise.mp4";

  }

  if (theme === "night") {

    return "./assets/Night.mp4";

  }

  return "./assets/Sunrise.mp4";

}

function updateVideo() {

  const theme = body.dataset.theme;

  const source = backgroundVideo.querySelector("source");

  source.src = getVideo(theme);

  backgroundVideo.load();

  backgroundVideo.play().catch(() => { });

}

function applyTheme() {

  const hour = new Date().getHours();

  const theme = getThemeByHour(hour);

  body.dataset.theme = theme;

  if (mainContent) {

    mainContent.className = "main-content";

    mainContent.classList.add(theme);

  }

  updateVideo();

}

// ======================================
// THEME TOGGLE
// ======================================

function updateThemeUI() {

  const mode = body.dataset.themeMode;

  if (mode === "light") {

    themeIcon.textContent = "☀️";

    themeText.textContent = "Light";

  }

  else {

    themeIcon.textContent = "🌙";

    themeText.textContent = "Dark";

  }

}

function toggleTheme() {

  const current = body.dataset.themeMode;

  const next = current === "light" ? "dark" : "light";

  body.dataset.themeMode = next;

  localStorage.setItem("dashboard-theme-mode", next);

  updateThemeUI();

  updateVideo();

}

// ======================================
// QUOTES
// ======================================

async function loadQuote() {

  try {

    const response = await fetch(QUOTE_URL);

    const data = await response.json();

    const random = data[Math.floor(Math.random() * data.length)];

    quote.textContent = random.quote;

    author.textContent = `— ${random.author}`;

  }

  catch {

    quote.textContent = "Stay consistent. Success will follow.";

    author.textContent = "";

  }

}

// ======================================
// SIDEBAR
// ======================================

menuBtn.addEventListener("click", () => {

  sidebar.classList.toggle("open");

});

// ======================================
// HELPERS
// ======================================

function hideMenu() {

  if (window.innerWidth <= 800) {

    menuBtn.style.display = "none";

  }

}

function showMenu() {

  if (window.innerWidth <= 800) {

    menuBtn.style.display = "flex";

  }

}

function closeSidebar() {

  sidebar.classList.remove("open");

}

// ======================================
// INITIALIZE
// ======================================

document.addEventListener("DOMContentLoaded", () => {

  const saved = localStorage.getItem("dashboard-theme-mode");

  if (saved) {

    body.dataset.themeMode = saved;

  }

  else {

    const hour = new Date().getHours();

    body.dataset.themeMode = (hour >= 6 && hour < 18) ? "light" : "dark";

  }

  loadWeather();

  loadQuote();

  applyTheme();

  updateClock();

  updateThemeUI();

  setInterval(updateClock, 1000);

  themeToggle.addEventListener("click", toggleTheme);

});

// ======================================
// TODO LIST MODULE
// ======================================

const todoBtn = document.getElementById("todoBtn");
const todoPage = document.getElementById("todoPage");
const backBtn = document.getElementById("backBtn");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const TODO_STORAGE_KEY = "todoTasks";

// --------------------
// Open Todo Page
// --------------------

todoBtn.addEventListener("click", (e) => {
  e.preventDefault();

  todoPage.style.display = "block";

  hideMenu();
  closeSidebar();
});

// --------------------
// Back To Dashboard
// --------------------

backBtn.addEventListener("click", () => {
  todoPage.style.display = "none";

  showMenu();
});

// --------------------
// Add Task Events
// --------------------

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// --------------------
// Add Task
// --------------------

function addTask(text = null, completed = false) {

  const taskText = text || taskInput.value.trim();

  if (!taskText) return;

  const li = document.createElement("li");

  li.className = "task-item";

  li.innerHTML = `
  
      <div class="task-left">

          <input
              type="checkbox"
              class="complete-checkbox"
              ${completed ? "checked" : ""}
          >

          <span class="task-text ${completed ? "completed" : ""}">
              ${taskText}
          </span>

      </div>

      <div class="task-actions">

          <button class="edit-btn">
              Edit
          </button>

          <button class="delete-btn">
              Delete
          </button>

      </div>

    `;

  taskList.appendChild(li);

  taskInput.value = "";

  attachTaskEvents(li);

  saveTasks();
}

// --------------------
// Task Events
// --------------------

function attachTaskEvents(task) {

  const checkbox = task.querySelector(".complete-checkbox");

  const text = task.querySelector(".task-text");

  const editBtn = task.querySelector(".edit-btn");

  const deleteBtn = task.querySelector(".delete-btn");

  checkbox.addEventListener("change", () => {

    text.classList.toggle("completed");

    saveTasks();

  });

  editBtn.addEventListener("click", () => {

    const updated = prompt("Edit Task", text.textContent);

    if (updated === null) return;

    if (!updated.trim()) return;

    text.textContent = updated.trim();

    saveTasks();

  });

  deleteBtn.addEventListener("click", () => {

    if (!confirm("Delete this task?")) return;

    task.remove();

    saveTasks();

  });

}

// --------------------
// Save
// --------------------

function saveTasks() {

  const tasks = [];

  document.querySelectorAll(".task-item").forEach((item) => {

    tasks.push({

      text: item.querySelector(".task-text").textContent,

      completed: item.querySelector(".complete-checkbox").checked

    });

  });

  localStorage.setItem(

    TODO_STORAGE_KEY,

    JSON.stringify(tasks)

  );

}

// --------------------
// Load
// --------------------

function loadTasks() {

  const savedTasks = JSON.parse(

    localStorage.getItem(TODO_STORAGE_KEY)

  ) || [];

  taskList.innerHTML = "";

  savedTasks.forEach((task) => {

    addTask(

      task.text,

      task.completed

    );

  });

}

// --------------------
// Clear All (Optional)
// --------------------

function clearTasks() {

  if (!confirm("Delete all tasks?")) return;

  taskList.innerHTML = "";

  localStorage.removeItem(TODO_STORAGE_KEY);

}

// --------------------
// Initialize
// --------------------

loadTasks();

// ======================================
// POMODORO MODULE
// ======================================

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

const STORAGE_KEY = "pomodoroStats";

let timer = null;

let totalTime = 25 * 60;
let timeLeft = totalTime;

let stats = {
    sessions: 0,
    minutes: 0
};

// --------------------
// Open Page
// --------------------

timerBtn.addEventListener("click", (e) => {

    e.preventDefault();

    pomodoroPage.style.display = "block";

    hideMenu();

    closeSidebar();

});

// --------------------
// Back
// --------------------

timerBackBtn.addEventListener("click", () => {

    pomodoroPage.style.display = "none";

    showMenu();

});

// --------------------
// Display
// --------------------

function updateTimerDisplay(){

    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}

// --------------------
// Session Change
// --------------------

sessions.forEach(button=>{

    button.addEventListener("click",()=>{

        sessions.forEach(item=>item.classList.remove("active"));

        button.classList.add("active");

        stopTimer();

        switch(button.textContent.trim()){

            case "Focus":
                totalTime=25*60;
                break;

            case "Break":
                totalTime=5*60;
                break;

            case "Long Break":
                totalTime=15*60;
                break;

        }

        timeLeft=totalTime;

        updateTimerDisplay();

    });

});

// --------------------
// Start
// --------------------

startBtn.addEventListener("click",()=>{

    if(timer) return;

    timer=setInterval(()=>{

        if(timeLeft>0){

            timeLeft--;

            updateTimerDisplay();

            return;

        }

        sessionCompleted();

    },1000);

});

// --------------------
// Pause
// --------------------

pauseBtn.addEventListener("click",stopTimer);

// --------------------
// Reset
// --------------------

resetBtn.addEventListener("click",()=>{

    stopTimer();

    timeLeft=totalTime;

    updateTimerDisplay();

});

// --------------------
// Stop Timer
// --------------------

function stopTimer(){

    clearInterval(timer);

    timer=null;

}

// --------------------
// Session Finished
// --------------------

function sessionCompleted(){

    stopTimer();

    const currentSession=document
        .querySelector(".session.active")
        .textContent.trim();

    if(currentSession==="Focus"){

        stats.sessions++;

        stats.minutes+=25;

        saveStats();

        updateStats();

    }

    alert("🍅 Session Complete!");

}

// --------------------
// Stats
// --------------------

function updateStats(){

    completedSessions.textContent=stats.sessions;

    focusMinutes.textContent=stats.minutes+"m";

}

// --------------------
// LocalStorage
// --------------------

function saveStats(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(stats)

    );

}

function loadStats(){

    const saved=JSON.parse(

        localStorage.getItem(STORAGE_KEY)

    );

    if(saved){

        stats=saved;

    }

    updateStats();

}

// --------------------
// Init
// --------------------

loadStats();

updateTimerDisplay();

// ======================================
// GOALS MODULE
// ======================================

const goalsBtn = document.getElementById("goalsBtn");
const goalsPage = document.getElementById("goalsPage");
const goalsBackBtn = document.getElementById("goalsBackBtn");

const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalList = document.getElementById("goalList");

const GOALS_STORAGE_KEY = "dashboardGoals";

// --------------------------------------
// Open Goals
// --------------------------------------

goalsBtn.addEventListener("click", (e) => {

    e.preventDefault();

    goalsPage.style.display = "block";

    hideMenu();

    closeSidebar();

});

// --------------------------------------
// Back
// --------------------------------------

goalsBackBtn.addEventListener("click", () => {

    goalsPage.style.display = "none";

    showMenu();

});

// --------------------------------------
// Add Goal
// --------------------------------------

addGoalBtn.addEventListener("click", addGoal);

goalInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        addGoal();

    }

});

// --------------------------------------
// Create Goal
// --------------------------------------

function addGoal(text = null, completed = false) {

    const goalText = text || goalInput.value.trim();

    if (!goalText) return;

    const li = document.createElement("li");

    li.className = "goal-item";

    li.innerHTML = `

        <span class="goal-text ${completed ? "completed" : ""}">
            ${goalText}
        </span>

        <div class="goal-actions">

            <button class="complete-goal">
                ${completed ? "Undo" : "Complete"}
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

    attachGoalEvents(li);

    saveGoals();

}

// --------------------------------------
// Events
// --------------------------------------

function attachGoalEvents(goal) {

    const text = goal.querySelector(".goal-text");

    const completeBtn = goal.querySelector(".complete-goal");

    const editBtn = goal.querySelector(".edit-goal");

    const deleteBtn = goal.querySelector(".delete-goal");

    completeBtn.addEventListener("click", () => {

        text.classList.toggle("completed");

        completeBtn.textContent =
            text.classList.contains("completed")
                ? "Undo"
                : "Complete";

        saveGoals();

    });

    editBtn.addEventListener("click", () => {

        const updated = prompt("Edit Goal", text.textContent);

        if (updated === null) return;

        if (!updated.trim()) return;

        text.textContent = updated.trim();

        saveGoals();

    });

    deleteBtn.addEventListener("click", () => {

        if (!confirm("Delete this goal?")) return;

        goal.remove();

        saveGoals();

    });

}

// --------------------------------------
// Save
// --------------------------------------

function saveGoals() {

    const goals = [];

    document.querySelectorAll(".goal-item").forEach((item) => {

        goals.push({

            text: item.querySelector(".goal-text").textContent,

            completed: item
                .querySelector(".goal-text")
                .classList.contains("completed")

        });

    });

    localStorage.setItem(

        GOALS_STORAGE_KEY,

        JSON.stringify(goals)

    );

}

// --------------------------------------
// Load
// --------------------------------------

function loadGoals() {

    const goals = JSON.parse(

        localStorage.getItem(GOALS_STORAGE_KEY)

    ) || [];

    goalList.innerHTML = "";

    goals.forEach(goal => {

        addGoal(

            goal.text,

            goal.completed

        );

    });

}

// --------------------------------------
// Clear All (Optional)
// --------------------------------------

function clearGoals() {

    if (!confirm("Delete all goals?")) return;

    goalList.innerHTML = "";

    localStorage.removeItem(GOALS_STORAGE_KEY);

}

// --------------------------------------
// Init
// --------------------------------------

loadGoals();

// ======================================
// MOTIVATION MODULE
// ======================================

const motivationBtn = document.getElementById("motivationBtn");
const motivationPage = document.getElementById("motivationPage");
const motivationBackBtn = document.getElementById("motivationBackBtn");

const motivationQuote = document.getElementById("motivationQuote");
const motivationAuthor = document.getElementById("motivationAuthor");
const newQuoteBtn = document.getElementById("newQuoteBtn");

// --------------------
// Open
// --------------------

motivationBtn.addEventListener("click",(e)=>{

    e.preventDefault();

    motivationPage.style.display="block";

    hideMenu();

    closeSidebar();

    loadMotivationQuote();

});

// --------------------
// Back
// --------------------

motivationBackBtn.addEventListener("click",()=>{

    motivationPage.style.display="none";

    showMenu();

});

// --------------------
// New Quote
// --------------------

newQuoteBtn.addEventListener("click",loadMotivationQuote);

async function loadMotivationQuote(){

    try{

        const response=await fetch(QUOTE_URL);

        const data=await response.json();

        const random=data[Math.floor(Math.random()*data.length)];

        motivationQuote.textContent=random.quote;

        motivationAuthor.textContent="— "+random.author;

    }

    catch{

        motivationQuote.textContent=
        "Believe in yourself. Success comes from consistency.";

        motivationAuthor.textContent="";

    }

}

// ======================================
// DAILY PLANNER
// ======================================

const dailyPlanBtn=document.getElementById("dailyPlanBtn");

const plannerPage=document.getElementById("plannerPage");

const plannerBackBtn=document.getElementById("plannerBackBtn");

const plannerHour=document.getElementById("plannerHour");

const plannerMinute=document.getElementById("plannerMinute");

const plannerPeriod=document.getElementById("plannerPeriod");

const plannerTask=document.getElementById("plannerTask");

const addPlanBtn=document.getElementById("addPlanBtn");

const plannerList=document.getElementById("plannerList");

const PLANNER_KEY="dailyPlanner";

// --------------------
// Open
// --------------------

dailyPlanBtn.addEventListener("click",(e)=>{

    e.preventDefault();

    plannerPage.style.display="block";

    hideMenu();

    closeSidebar();

});

// --------------------
// Back
// --------------------

plannerBackBtn.addEventListener("click",()=>{

    plannerPage.style.display="none";

    showMenu();

});

// --------------------
// Events
// --------------------

addPlanBtn.addEventListener("click",addPlan);

plannerTask.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        addPlan();

    }

});

// --------------------
// Add
// --------------------

function addPlan(){

    const hour=plannerHour.value.trim();

    const minute=plannerMinute.value.trim();

    const period=plannerPeriod.value;

    const task=plannerTask.value.trim();

    if(!hour || !minute || !task){

        return;

    }

    createPlan(

        `${hour}:${minute.padStart(2,"0")} ${period}`,

        task,

        false

    );

    plannerHour.value="";

    plannerMinute.value="";

    plannerPeriod.value="AM";

    plannerTask.value="";

    savePlans();

}

// --------------------
// Create
// --------------------

function createPlan(time,text,completed=false){

    const card=document.createElement("div");

    card.className="plan-card";

    card.innerHTML=`

        <div class="plan-left">

            <input
                type="checkbox"
                class="plan-check"
                ${completed?"checked":""}
            >

            <span class="plan-time">${time}</span>

            <span class="plan-text ${completed?"completed":""}">
                ${text}
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

    plannerList.appendChild(card);

    attachPlanEvents(card);

}

// --------------------
// Events
// --------------------

function attachPlanEvents(plan){

    const check=plan.querySelector(".plan-check");

    const text=plan.querySelector(".plan-text");

    check.addEventListener("change",()=>{

        text.classList.toggle("completed");

        savePlans();

    });

    plan.querySelector(".edit-plan").addEventListener("click",()=>{

        const updated=prompt("Edit Plan",text.textContent);

        if(updated===null) return;

        if(!updated.trim()) return;

        text.textContent=updated.trim();

        savePlans();

    });

    plan.querySelector(".delete-plan").addEventListener("click",()=>{

        if(!confirm("Delete this plan?")) return;

        plan.remove();

        savePlans();

    });

}

// --------------------
// Save
// --------------------

function savePlans(){

    const plans=[];

    document.querySelectorAll(".plan-card").forEach(plan=>{

        plans.push({

            time:plan.querySelector(".plan-time").textContent,

            task:plan.querySelector(".plan-text").textContent,

            completed:plan.querySelector(".plan-check").checked

        });

    });

    localStorage.setItem(

        PLANNER_KEY,

        JSON.stringify(plans)

    );

}

// --------------------
// Load
// --------------------

function loadPlans(){

    const plans=JSON.parse(

        localStorage.getItem(PLANNER_KEY)

    )||[];

    plannerList.innerHTML="";

    plans.forEach(plan=>{

        createPlan(

            plan.time,

            plan.task,

            plan.completed

        );

    });

}

// ======================================
// WINDOW RESIZE
// ======================================

window.addEventListener("resize",()=>{

    if(window.innerWidth>800){

        menuBtn.style.display="none";

        sidebar.classList.remove("open");

    }

    else{

        menuBtn.style.display="flex";

    }

});

// ======================================
// FINAL INIT
// ======================================

loadTasks();

loadGoals();

loadPlans();

loadStats();

updateTimerDisplay();

loadWeather();

loadQuote();

updateClock();

setInterval(updateClock,1000);