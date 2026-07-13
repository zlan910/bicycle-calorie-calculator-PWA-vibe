import { calculateRide, UNIT_FACTORS } from "./calculator.js";

const form = document.querySelector("form");
const courseInputs = document.querySelectorAll('input[name="course"]');
const unitInputs = document.querySelectorAll('input[name="units"]');
const optionalPointToPoint = document.querySelectorAll("[data-point-to-point]");
const error = document.querySelector("#error");
const warning = document.querySelector("#warning");
const results = document.querySelector("#results");
let units = "imperial";

function numberFrom(name) {
  const value = form.elements[name].value.trim();
  return value === "" ? 0 : Number(value);
}

function setCourseFields() {
  const pointToPoint = form.elements.course.value === "point-to-point";
  optionalPointToPoint.forEach((element) => {
    element.disabled = !pointToPoint;
    element.closest(".field")?.classList.toggle("is-disabled", !pointToPoint);
  });
}

function updateUnitLabels() {
  const factor = UNIT_FACTORS[units];
  document.querySelectorAll("[data-unit]").forEach((element) => {
    element.textContent = factor[element.dataset.unit + "Label"];
  });
}

function convertUnits(nextUnits) {
  if (nextUnits === units) return;

  const previous = UNIT_FACTORS[units];
  const next = UNIT_FACTORS[nextUnits];
  [
    ["distance", "distance"],
    ["weight", "weight"],
    ["elevationGain", "elevation"],
    ["windSpeed", "distance"],
  ].forEach(([field, factor]) => {
    const input = form.elements[field];
    if (input.value.trim() !== "" && Number.isFinite(Number(input.value))) {
      const internalValue = Number(input.value) * previous[factor];
      input.value = Number((internalValue / next[factor]).toFixed(4)).toString();
    }
  });
  units = nextUnits;
  updateUnitLabels();
  results.hidden = true;
  error.hidden = true;
  warning.hidden = true;
}

function format(value, digits = 1) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

courseInputs.forEach((input) => input.addEventListener("change", setCourseFields));
unitInputs.forEach((input) => input.addEventListener("change", () => convertUnits(input.value)));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  error.hidden = true;

  try {
    const factor = UNIT_FACTORS[units];
    const stats = calculateRide({
      distance: numberFrom("distance") * factor.distance,
      hours: numberFrom("hours"),
      minutes: numberFrom("minutes"),
      seconds: numberFrom("seconds"),
      weight: numberFrom("weight") * factor.weight,
      course: form.elements.course.value,
      windSpeed: numberFrom("windSpeed") * factor.distance,
      windDirection: form.elements.windDirection.value,
      draftingPercent: numberFrom("draftingPercent"),
      climbingPercent: numberFrom("climbingPercent"),
      elevationGain: numberFrom("elevationGain") * factor.elevation,
      ridingPosition: form.elements.ridingPosition.value,
    });
    document.querySelector("#average-speed").textContent = `${format(stats.averageSpeed / factor.distance)} ${factor.distanceLabel}/h`;
    document.querySelector("#total-calories").textContent = `${format(stats.totalCalories, 0)} kcal`;
    document.querySelector("#riding-calories").textContent = `${format(stats.ridingCalories, 0)} kcal`;
    warning.textContent = stats.warnings.join(" ");
    warning.hidden = stats.warnings.length === 0;
    results.hidden = false;
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (problem) {
    error.textContent = problem.message;
    error.hidden = false;
    warning.hidden = true;
    results.hidden = true;
  }
});

setCourseFields();
updateUnitLabels();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}
