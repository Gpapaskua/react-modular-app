import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import { determineAlarmStatus } from "./utils";

vi.mock("@/lib/constants", () => ({
  ALARM_STATUSES: ["Normal", "Low", "High", "Critical High"],
}));

describe("determineAlarmStatus", () => {
  const originalMathRandom = Math.random;

  beforeEach(() => {
    Math.random = vi.fn();
  });

  afterEach(() => {
    Math.random = originalMathRandom;
  });

  it('should return "Normal" status when Math.random returns a value for index 0', () => {
    (Math.random as Mock).mockReturnValue(0.1);

    const result = determineAlarmStatus();
    expect(result).toEqual({
      status: "Normal",
      colorClass: "text-green-600",
    });
  });

  it('should return "Low" status when Math.random returns a value for index 1', () => {
    (Math.random as Mock).mockReturnValue(0.3);

    const result = determineAlarmStatus();
    expect(result).toEqual({
      status: "Low",
      colorClass: "text-yellow-500",
    });
  });

  it('should return "High" status when Math.random returns a value for index 2', () => {
    (Math.random as Mock).mockReturnValue(0.6);

    const result = determineAlarmStatus();
    expect(result).toEqual({
      status: "High",
      colorClass: "text-orange-500",
    });
  });

  it('should return "Critical High" status when Math.random returns a value for index 3', () => {
    (Math.random as Mock).mockReturnValue(0.9);

    const result = determineAlarmStatus();
    expect(result).toEqual({
      status: "Critical High",
      colorClass: "text-red-600 animate-pulse",
    });
  });
});
