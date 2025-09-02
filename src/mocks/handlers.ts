import { getPersistedData, persistData } from "@/lib/local-storage";
import { findOptionById } from "@/lib/utils";
import type { IGroup, IParameter } from "@/pages/inputs/chemistry/types";
import { http, HttpResponse } from "msw";

const initialData: IGroup[] = [
  {
    id: "group-1",
    name: "Acid Waste Treatment",
    description: "Initial processing of acidic byproducts.",
    parameters: [
      {
        id: "alk",
        name: "Alkalinity",
        value: 10.5,
        units: "mg/L",
      },
      {
        id: "ph",
        name: "pH",
        value: 2.1,
        units: "pH",
      },
      {
        id: "fl",
        name: "Fluoride",
        value: 15.0,
        units: "mg/L",
      },
    ],
  },
  {
    id: "group-2",
    name: "B41 Scrubber System",
    description: "Air abatement and purification.",
    parameters: [
      {
        id: "alk",
        name: "Alkalinity",
        value: 106.0,
        units: "mg/L",
      },
      {
        id: "amm",
        name: "Ammonium",
        value: 0.78,
        units: "mg/L",
      },
      {
        id: "fl",
        name: "Fluoride",
        value: 0.78,
        units: "mg/L",
      },
      {
        id: "ttc",
        name: "Total Organic Carbon",
        value: 11.6,
        units: "mg/L",
      },
    ],
  },
];

let groupData = getPersistedData(initialData);

export const handlers = [
  // Get all groups
  http.get("/api/groups", () => {
    return HttpResponse.json(groupData);
  }),

  // Update group fields, used for name/description updates
  http.patch<{ groupId: string }, IGroup>(
    "/api/groups/:groupId",
    async ({ request, params }) => {
      const { groupId } = params;
      const updates = await request.json();

      groupData = groupData.map((group) => {
        if (group.id === groupId) {
          return { ...group, ...updates };
        }
        return group;
      });

      const updatedGroup = groupData.find((group) => group.id === groupId);

      if (!updatedGroup) {
        return new HttpResponse(null, { status: 404 });
      }

      persistData(groupData);
      return HttpResponse.json(updatedGroup);
    }
  ),

  // Add new param
  http.put<{ groupId: string }, { paramId: string }>(
    "/api/groups/:groupId/parameters",
    async ({ request, params }) => {
      const { groupId } = params;
      const { paramId } = await request.json();

      const paramOption = findOptionById(paramId);
      if (!paramOption) {
        return new HttpResponse(
          JSON.stringify({ message: "Parameter ID not found in master list." }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const groupToUpdate = groupData.find((g) => g.id === groupId);
      if (!groupToUpdate) {
        return new HttpResponse(
          JSON.stringify({ message: "Group not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const paramExists = groupToUpdate.parameters.some(
        (p) => p.name === paramOption.label
      );
      if (paramExists) {
        return new HttpResponse(
          JSON.stringify({
            message: `Parameter "${paramOption.label}" already exists in this group.`,
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const newParam = {
        id: paramOption.value,
        name: paramOption.label,
        value: paramOption.defaultValue,
        units: paramOption.units,
      };
      groupToUpdate.parameters.push(newParam);

      persistData(groupData);
      return HttpResponse.json(groupToUpdate);
    }
  ),

  // Update single parameter in group
  http.put<{ groupId: string; parameterId: string }, Omit<IParameter, "id">>(
    "/api/groups/:groupId/parameters/:parameterId",
    async ({ request, params }) => {
      const { groupId, parameterId } = params;
      const updatedParamData = await request.json();

      const groupToUpdate = groupData.find((g) => g.id === groupId);

      if (!groupToUpdate) {
        return new HttpResponse(
          JSON.stringify({ message: "Group not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const paramIndex = groupToUpdate.parameters.findIndex(
        (p) => p.id === parameterId
      );

      if (paramIndex === -1) {
        return new HttpResponse(
          JSON.stringify({ message: "Parameter not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      groupToUpdate.parameters[paramIndex] = {
        ...groupToUpdate.parameters[paramIndex],
        ...updatedParamData,
      };

      persistData(groupData);
      return HttpResponse.json(groupToUpdate);
    }
  ),
];
