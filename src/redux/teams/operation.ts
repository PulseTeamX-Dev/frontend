import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../shared/api/apiClient";
import type { TeamInfo, TeamMember, ImportEmailsResponse } from "./types";

export const fetchTeams = createAsyncThunk<
  TeamInfo[],
  void,
  { rejectValue: string }
>("team/fetchTeams", async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get("/teams");
    return data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || "Failed to fetch teams",
    );
  }
});

export const createTeam = createAsyncThunk<
  TeamInfo,
  { name: string },
  { rejectValue: string }
>("team/createTeam", async (payload, thunkAPI) => {
  try {
    const { data } = await apiClient.post("/teams", payload);
    return data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || "Failed to create team",
    );
  }
});

export const rotateTeamToken = createAsyncThunk<
  TeamInfo,
  number,
  { rejectValue: string }
>("team/rotateToken", async (teamId, thunkAPI) => {
  try {
    const { data } = await apiClient.patch(`/teams/${teamId}/rotate-token`);

    return data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || "Failed to rotate token",
    );
  }
});

export const addMember = createAsyncThunk<
  TeamMember,
  number,
  { rejectValue: string }
>("team/addMember", async (teamId, thunkAPI) => {
  try {
    const { data } = await apiClient.put(`/teams/${teamId}/members`);

    return data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || "Failed to add member",
    );
  }
});

export const archiveMember = createAsyncThunk<
  TeamMember,
  { teamId: number; userId: number },
  { rejectValue: string }
>("team/archiveMember", async (payload, thunkAPI) => {
  try {
    const { data } = await apiClient.patch(
      `/teams/${payload.teamId}/members/${payload.userId}`,
    );

    return data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || "Failed to archive member",
    );
  }
});

export const archiveTeam = createAsyncThunk<
  TeamInfo,
  number,
  { rejectValue: string }
>("team/archiveTeam", async (teamId, thunkAPI) => {
  try {
    const { data } = await apiClient.patch(`/teams/${teamId}/archive`);

    return data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || "Failed to archive team",
    );
  }
});

export const importTeamEmails = createAsyncThunk<
  ImportEmailsResponse,
  {
    teamId: number;
    emails: string[];
  },
  { rejectValue: string }
>("team/importTeamEmails", async ({ teamId, emails }, thunkAPI) => {
  try {
    const { data } = await apiClient.post(`/teams/${teamId}/emails`, {
      emails,
    });
    return data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response?.data?.message ?? "Failed to import emails",
    );
  }
});
