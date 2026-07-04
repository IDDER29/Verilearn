import { describe, expect, it } from "vitest";
import { formatInterval } from "./format";

describe("formatInterval", () => {
  it("renders sub-hour relearn steps in minutes", () => {
    expect(formatInterval(5 / 1440)).toBe("< 5 min"); // 5-minute relearn step
    expect(formatInterval(0)).toBe("< 1 min");
  });

  it("renders sub-day intervals in hours", () => {
    expect(formatInterval(3 / 24)).toBe("3h");
    expect(formatInterval(23 / 24)).toBe("23h");
  });

  it("renders day, month, and year scales", () => {
    expect(formatInterval(4)).toBe("4 days");
    expect(formatInterval(60)).toBe("2 mo");
    expect(formatInterval(730)).toBe("2 yr");
  });

  it("is monotonic across increasing FSRS intervals", () => {
    // labels should never collapse for the strictly-increasing again→easy set
    const labels = [5 / 1440, 2, 9, 40].map(formatInterval);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
