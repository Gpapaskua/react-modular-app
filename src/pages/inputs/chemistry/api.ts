import { apiClient } from "@/lib/axios";
import type { IGroup, IParameter } from "./types";

export const getChemistryData = async (): Promise<IGroup[]> => {
  const { data } = await apiClient.get("/groups");
  return data;
};

export const updateChemistryGroup = async ({
  groupId,
  payload,
}: {
  groupId: string;
  payload: Partial<IGroup>;
}) => {
  const { data } = await apiClient.patch(`/groups/${groupId}`, payload);
  return data;
};

export const addNewParamToGroup = async ({
  groupId,
  paramId,
}: {
  groupId: string;
  paramId: string;
}) => {
  const { data } = await apiClient.put(`/groups/${groupId}/parameters`, {
    paramId,
  });
  return data;
};

export const updateGroupParam = async ({
  paramId,
  groupId,
  payload,
}: {
  paramId: string;
  groupId: string;
  payload: Partial<Omit<IParameter, "id">>;
}) => {
  const { data } = await apiClient.put(
    `/groups/${groupId}/parameters/${paramId}`,
    payload
  );
  return data;
};
