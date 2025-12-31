import { formatCurrency, subtractDates } from "./helpers";
import { describe, it, expect } from "vitest";

describe("Helper Functions", () => {
  it("formats currency correctly", () => {
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(20)).toBe("$20.00");
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("calculates date difference correctly", () => {
    // 2024-01-05 minus 2024-01-01 = 4 days
    const date1 = "2024-01-05T00:00:00.000Z";
    const date2 = "2024-01-01T00:00:00.000Z";
    expect(subtractDates(date1, date2)).toBe(4);
  });
});
