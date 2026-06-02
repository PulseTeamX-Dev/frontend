import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";
import type { DashboardMetrics, AlertsResponse } from "./types";

export const fetchMetrics = createAsyncThunk<
  DashboardMetrics,
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
      (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response?.data?.message ?? "Failed to fetch metrics",
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
      (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response?.data?.message ?? "Failed to fetch alerts",
    );
  }
});
