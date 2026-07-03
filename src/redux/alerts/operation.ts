import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../shared/api/apiClient";
import type { Alert } from "./types";

export const fetchAlerts = createAsyncThunk<
  Alert[],
  void,
  { rejectValue: string }
>("alerts/fetchAlerts", async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get("/dashboard/alerts");

    return data.data;
  } catch {
    return thunkAPI.rejectWithValue("Не вдалося завантажити сигнали");
  }
});

export const resolveAlert = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("alerts/resolveAlert", async (alertId, thunkAPI) => {
  try {
    await apiClient.patch(`/dashboard/alerts/${alertId}/resolve`);

    return alertId;
  } catch {
    return thunkAPI.rejectWithValue("Не вдалося закрити сигнал");
  }
});

export const fetchAlertsAnalytics = createAsyncThunk(
  "alerts/fetchAnalytics",
  async (_, thunkAPI) => {
    try {
      const { data } = await apiClient.get("/dashboard/alerts/analytics");

      return data.data;
    } catch {
      return thunkAPI.rejectWithValue("Не вдалося завантажити аналітику");
    }
  },
);
