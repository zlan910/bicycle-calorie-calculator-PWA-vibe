/**
 * Bicycle Ride Calorie Calculator formula.
 *
 * Ported from CalCalcEngine.java (1997).  Internal units are miles, pounds,
 * feet, and minutes so the calculation remains compatible with the original.
 */

export const UNIT_FACTORS = Object.freeze({
  imperial: { distance: 1, weight: 1, elevation: 1, distanceLabel: "mi", weightLabel: "lb", elevationLabel: "ft" },
  metric: { distance: 0.62137, weight: 2.20462, elevation: 3.28084, distanceLabel: "km", weightLabel: "kg", elevationLabel: "m" },
});

function baseline(speedMph, weightLb) {
  return (
    8.79618e-6 * speedMph ** 3 -
    1.46998e-4 * speedMph ** 2 +
    0.00359 * speedMph +
    0.00556
  ) * weightLb;
}

/**
 * Calculates ride statistics using the original application's equations.
 * All arguments must use the internal English units described above.
 */
export function calculateRide({
  distance,
  hours = 0,
  minutes = 0,
  seconds = 0,
  weight,
  course = "loop",
  windSpeed = 0,
  windDirection = "head",
  draftingPercent = 0,
  climbingPercent = 0,
  elevationGain = 0,
  ridingPosition = "aero",
}) {
  const values = [distance, hours, minutes, seconds, weight, windSpeed, draftingPercent, climbingPercent, elevationGain];
  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new RangeError("All values must be valid, non-negative numbers.");
  }

  const durationMinutes = hours * 60 + minutes + seconds / 60;
  if (distance <= 0 || weight <= 0 || durationMinutes <= 0) {
    throw new RangeError("Distance, weight, and ride time must be greater than zero.");
  }

  const averageSpeed = distance / (durationMinutes / 60);
  const base = baseline(averageSpeed, weight);
  let modifiedBase = base - ((weight - 154) / 200) * base;
  let terrainAdjustment = (climbingPercent / 1000) * modifiedBase;

  if (course === "point-to-point") {
    terrainAdjustment += (weight * elevationGain * 0.0014) / durationMinutes;
    modifiedBase += terrainAdjustment;

    const directionMultiplier = {
      head: 1,
      "cross-head": 0.7,
      "cross-tail": 0.7,
      tail: 1,
    }[windDirection];
    const speedDirection = {
      head: 1,
      "cross-head": 1,
      "cross-tail": -1,
      tail: -1,
    }[windDirection];

    if (directionMultiplier !== undefined) {
      const windAdjustedBase = baseline(averageSpeed + speedDirection * windSpeed / 2, weight);
      modifiedBase += directionMultiplier * (windAdjustedBase - base);
    }
  }

  if (averageSpeed > 15 && ridingPosition === "non-aero") {
    modifiedBase += (-0.66893 + 0.0467 * averageSpeed) * modifiedBase;
  }

  modifiedBase -= (draftingPercent / 100) * (averageSpeed / 100);
  const totalCalories = modifiedBase * durationMinutes;
  const ridingCalories = (modifiedBase - weight * 0.01) * durationMinutes;

  return Object.freeze({
    averageSpeed,
    totalCalories,
    ridingCalories,
    naturalCalories: totalCalories - ridingCalories,
  });
}
