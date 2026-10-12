// Same origin as the API on Render. For local frontend-only testing, set e.g. "http://127.0.0.1:8000"
const API_BASE = "";

const COUNTRIES = [
  "India", "USA", "Canada", "Australia", "UK", "Germany", "Mexico", "Turkey", "France",
  "Pakistan", "Bangladesh", "Nepal", "Sri Lanka", "China", "Japan", "South Korea",
  "Singapore", "Malaysia", "Indonesia", "Philippines", "Vietnam", "Thailand",
  "UAE", "Saudi Arabia", "Egypt", "Nigeria", "South Africa", "Kenya", "Ghana",
  "Brazil", "Argentina", "Chile", "Colombia", "Spain", "Italy", "Portugal",
  "Netherlands", "Belgium", "Sweden", "Norway", "Denmark", "Finland", "Poland",
  "Russia", "Ukraine", "Ireland", "Switzerland", "Austria", "New Zealand", "Other"
];

const form = document.getElementById("predict-form");
const btn = document.getElementById("submit-btn");
const arc = document.getElementById("arc");
const scoreEl = document.getElementById("score");
const badge = document.getElementById("badge");
const message = document.getElementById("message");
const errorEl = document.getElementById("error");
const countryInput = document.getElementById("Country");

const ARC_LENGTH = 282.74;
const MESSAGES = {
  Bad: "Below average. Sleep, stress and screen time are the usual levers to look at first.",
  Good: "A healthy score. Small changes to routine could still push it higher.",
  Excellent: "A very strong score across the inputs provided."
};

// Country suggestions
document.getElementById("countries").innerHTML =
  COUNTRIES.map((c) => `<option value="${c}"></option>`).join("");

// Slider fill + live value
function syncSlider(input) {
  const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
  input.style.setProperty("--fill", pct + "%");
  const out = input.parentElement.querySelector("output");
  if (out) out.textContent = `${Number(input.value)} h`;
}
document.querySelectorAll('input[type="range"]').forEach((el) => {
  syncSlider(el);
  el.addEventListener("input", () => syncSlider(el));
});

function setError(text) {
  errorEl.textContent = text || "";
  errorEl.hidden = !text;
}

function animateScore(target) {
  const duration = 900;
  const start = performance.now();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { scoreEl.textContent = target.toFixed(1); return; }
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    scoreEl.textContent = (target * eased).toFixed(1);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function showResult(score, label) {
  const clamped = Math.max(0, Math.min(score, 10));
  const key = label.toLowerCase();
  arc.style.strokeDashoffset = ARC_LENGTH * (1 - clamped / 10);
  arc.style.stroke = `var(--${key})`;
  animateScore(score);
  badge.textContent = label;
  badge.className = `badge ${key}`;
  badge.hidden = false;
  message.textContent = MESSAGES[label] || "";
}

function formatApiError(data) {
  if (data && Array.isArray(data.detail)) {
    return data.detail
      .map((d) => `${(d.loc || []).slice(1).join(" ").replace(/_/g, " ")}: ${d.msg}`)
      .join(". ");
  }
  return (data && data.detail) || "The server could not process this request.";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError("");
  countryInput.classList.remove("invalid");

  if (!countryInput.value.trim()) {
    countryInput.classList.add("invalid");
    countryInput.focus();
    setError("Enter a country to continue.");
    return;
  }

  const fd = new FormData(form);
  const payload = {
    Age: parseInt(fd.get("Age"), 10),
    Gender: fd.get("Gender"),
    Country: fd.get("Country").trim(),
    Academic_Level: fd.get("Academic_Level"),
    Most_Used_Platform: fd.get("Most_Used_Platform"),
    Purpose_Of_Use: fd.get("Purpose_Of_Use"),
    Avg_Daily_Usage_Hours: parseFloat(fd.get("Avg_Daily_Usage_Hours")),
    Daily_Unlocks: parseInt(fd.get("Daily_Unlocks"), 10),
    Study_Hours: parseFloat(fd.get("Study_Hours")),
    Physical_Activity_Hours: parseFloat(fd.get("Physical_Activity_Hours")),
    Sleep_Hours_Per_Night: parseFloat(fd.get("Sleep_Hours_Per_Night")),
    Stress_Level: fd.get("Stress_Level")
  };

  btn.disabled = true;
  btn.textContent = "Predicting…";

  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(formatApiError(data));
    showResult(data.predicted_mental_health_score, data.label);
  } catch (err) {
    setError(err.message || "Could not reach the server. Check your connection and try again.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Predict score";
  }
});
