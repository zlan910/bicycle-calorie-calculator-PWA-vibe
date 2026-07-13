import assert from "node:assert/strict";
import test from "node:test";
import { calculateRide, UNIT_FACTORS } from "../calculator.js";

test("ignores uphill time for loop courses", () => {
  const result = calculateRide({ distance: 20, hours: 1, weight: 165, course: "loop", climbingPercent: 10 });
  const flatResult = calculateRide({ distance: 20, hours: 1, weight: 165, course: "loop" });
  assert.equal(result.averageSpeed, 20);
  assert.equal(result.totalCalories, flatResult.totalCalories);
});

test("applies point-to-point elevation and wind adjustments", () => {
  for (const windDirection of ["head", "cross-head", "cross-tail", "tail"]) {
    const result = calculateRide({ distance: 30, hours: 2, weight: 165, course: "point-to-point", windSpeed: 10, windDirection, elevationGain: 800, climbingPercent: 12, ridingPosition: "non-aero" });
    const flatResult = calculateRide({ distance: 30, hours: 2, weight: 165, course: "point-to-point", windSpeed: 10, windDirection, elevationGain: 800, climbingPercent: 0, ridingPosition: "non-aero" });
    assert.ok(Number.isFinite(result.totalCalories));
    assert.ok(Number.isFinite(result.ridingCalories));
    assert.ok(result.totalCalories > flatResult.totalCalories);
  }
});

test("rejects missing essential values", () => {
  assert.throws(() => calculateRide({ distance: 0, hours: 1, weight: 150 }), /greater than zero/);
});


test("keeps metric conversion factors consistent with the legacy calculator", () => {
  assert.equal(UNIT_FACTORS.metric.distance, 0.62137);
  assert.equal(UNIT_FACTORS.metric.weight, 2.20462);
  assert.equal(UNIT_FACTORS.metric.elevation, 3.28084);
});

test("reports when a ride is outside the recommended speed range", () => {
  const result = calculateRide({ distance: 4, hours: 1, weight: 150 });
  assert.equal(result.warnings.length, 1);
  assert.ok(result.warnings[0].includes("5 and 30 mi/h"));
});
