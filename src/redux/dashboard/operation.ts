import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";
import type { DashboardMetricsUnion, AlertsResponse } from "./types";
import { isAxiosError } from "axios";

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export const fetchMetrics = createAsyncThunk<
  DashboardMetricsUnion,
  string | undefined,
  { rejectValue: string }
>("dashboard/fetchMetrics", async (teamId, thunkAPI) => {
  try {
    const { data } = await apiClient.get("/dashboard/metrics", {
      params: teamId ? { teamId } : undefined,
    });
    return data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(error, "Failed to fetch metrics"),
    );
  }
});

export const fetchAlerts = createAsyncThunk<
  AlertsResponse,
  void,
  { rejectValue: string }
>("dashboard/fetchAlerts", async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get("/dashboard/alerts");
    return data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(error, "Failed to fetch alerts"),
    );
  }
});
