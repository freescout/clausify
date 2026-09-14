import { describe, expect, it } from "vitest";

import {
  formatRelativeTime,
  getRating,
  getRatingLabel,
  getScoreBarColor,
} from "./utils";

describe("utility helpers", () => {
  it("classifies score thresholds into the right ratings", () => {
    expect(getRating(10)).toBe("red");
    expect(getRating(31)).toBe("orange");
    expect(getRating(66)).toBe("green");
  });

  it("returns the human-friendly label and color for a rating", () => {
    expect(getRatingLabel("red")).toBe("High risk");
    expect(getRatingLabel("orange")).toBe("Moderate");
    expect(getScoreBarColor("green")).toBe("bg-safe");
  });

  it("formats relative timestamps for recent and older dates", () => {
    expect(
      formatRelativeTime(new Date(Date.now() - 30 * 1000).toISOString()),
    ).toBe("Just now");
    expect(
      formatRelativeTime(
        new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      ),
    ).toBe("2 hr ago");
    expect(
      formatRelativeTime(
        new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      ),
    ).toBe("Yesterday");
  });
});
