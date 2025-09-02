import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  persistGroupData,
  getPersistedData,
  persistData,
} from "./local-storage";
import type { IGroup } from "@/pages/inputs/chemistry/types";

const MSW_DATA_KEY = "msw-group-data";
// Mock data for testing
const mockGroupData: IGroup[] = [
  { id: "1", name: "Group A", description: "Description 1", parameters: [] },
  { id: "2", name: "Group B", description: "description 2", parameters: [] },
];

const fallbackData: IGroup[] = [
  {
    id: "fallback",
    name: "Fallback Group",
    description: "Fallback desc",
    parameters: [],
  },
];

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("localStorage persistence utilities", () => {
  beforeEach(() => {
    localStorageMock.clear();
    consoleErrorSpy.mockClear();
  });

  describe("persistGroupData", () => {
    it("should stringify and save the provided data to localStorage", () => {
      persistGroupData(mockGroupData);
      const stored = localStorage.getItem(MSW_DATA_KEY);
      expect(stored).toEqual(JSON.stringify(mockGroupData));
    });
  });

  describe("persistData", () => {
    it("should stringify and save the data to localStorage within a try-catch block", () => {
      persistData(mockGroupData);
      const stored = localStorage.getItem(MSW_DATA_KEY);
      expect(stored).toEqual(JSON.stringify(mockGroupData));
    });

    it("should handle errors gracefully if localStorage.setItem fails", () => {
      const error = new Error("Storage is full");
      vi.spyOn(localStorage, "setItem").mockImplementationOnce(() => {
        throw error;
      });

      expect(() => persistData(mockGroupData)).not.toThrow();

      // It should log the error to the console
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to persist mock data to localStorage:",
        error
      );
    });
  });

  describe("getPersistedData", () => {
    it("should return parsed data from localStorage if it exists", () => {
      localStorage.setItem(MSW_DATA_KEY, JSON.stringify(mockGroupData));
      const result = getPersistedData(fallbackData);
      expect(result).toEqual(mockGroupData);
    });

    it("should return fallback data if nothing is in localStorage", () => {
      const result = getPersistedData(fallbackData);
      expect(result).toEqual(fallbackData);
    });

    it("should persist the fallback data to localStorage if nothing was stored initially", () => {
      getPersistedData(fallbackData);
      const stored = localStorage.getItem(MSW_DATA_KEY);
      expect(stored).toEqual(JSON.stringify(fallbackData));
    });

    it("should return fallback data and log an error if stored data is invalid JSON", () => {
      localStorage.setItem(MSW_DATA_KEY, "this is not json");
      const result = getPersistedData(fallbackData);
      expect(result).toEqual(fallbackData);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain(
        "Failed to read or parse mock data from localStorage:"
      );
    });

    it("should return fallback data and log an error if localStorage.getItem throws", () => {
      const error = new Error("SecurityError");
      vi.spyOn(localStorage, "getItem").mockImplementationOnce(() => {
        throw error;
      });

      const result = getPersistedData(fallbackData);
      expect(result).toEqual(fallbackData);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to read or parse mock data from localStorage:",
        error
      );
    });
  });
});
