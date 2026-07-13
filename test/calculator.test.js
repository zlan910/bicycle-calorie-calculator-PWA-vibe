import assert from "node:assert/strict";
import test from "node:test";
import { calculateRide } from "../calculator.js";

test("reproduces the original loop-course calculation", () => {
  const result = calculateRide({ distance: 20, hours: 1, weight: 165, climbingPercent: 10 });
  assert.equal(result.averageSpeed, 20);
  assert.ok(Math.abs(result.totalCalories - 831.9868603199999) < 1e-9);
  assert.ok(Math.abs(result.ridingCalories - 732.9868603199999) < 1e-9);
});

test("applies point-to-point elevation and headwind adjustments", () => {
  const result = calculateRide({ distance: 30, hours: 2, weight: 165, course: "point-to-point", windSpeed: 10, windDirection: "head", elevationGain: 800, climbingPercent: 12, ridingPosition: "non-aero" });
  assert.ok(Math.abs(result.totalCalories - 1897.1890437630898) < 1e-9);
  assert.ok(Math.abs(result.ridingCalories - 1699.1890437630896) < 1e-9);
});

test("rejects missing essential values", () => {
  assert.throws(() => calculateRide({ distance: 0, hours: 1, weight: 150 }), /greater than zero/);
});
