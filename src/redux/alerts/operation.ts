import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";
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
