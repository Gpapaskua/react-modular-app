import type { IGroup } from "@/pages/inputs/chemistry/types";

const MSW_DATA_KEY = "msw-group-data";

export const persistGroupData = (groupData: IGroup[]) => {
  localStorage.setItem("msw-group-data", JSON.stringify(groupData));
};

export const getPersistedData = (fallbackData: IGroup[]) => {
  try {
    const storedData = localStorage.getItem(MSW_DATA_KEY);
    if (storedData) {
      return JSON.parse(storedData) as IGroup[];
    }
    localStorage.setItem(MSW_DATA_KEY, JSON.stringify(fallbackData));
    return fallbackData;
  } catch (error) {
    console.error(
      "Failed to read or parse mock data from localStorage:",
      error
    );
    return fallbackData;
  }
};

export const persistData = (groupData: IGroup[]) => {
  try {
    localStorage.setItem(MSW_DATA_KEY, JSON.stringify(groupData));
  } catch (error) {
    console.error("Failed to persist mock data to localStorage:", error);
  }
};
