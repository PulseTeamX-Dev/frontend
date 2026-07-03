import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../shared/api/apiClient";

import type {
  SurveyQuestion,
  SurveyDetails,
  SubmitSurveyResponse,
  SurveyAnswer,
} from "./types";

export const fetchQuestions = createAsyncThunk<
  SurveyQuestion[],
  void,
  { rejectValue: string }
>("surveys/fetchQuestions", async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get("/surveys/config");
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
      ).response?.data?.message ?? "Failed to fetch questions",
    );
  }
});

export const createQuestion = createAsyncThunk<
  SurveyQuestion,
  Omit<SurveyQuestion, "question_id" | "created_at">,
  { rejectValue: string }
>("surveys/createQuestion", async (payload, thunkAPI) => {
  try {
    const { data } = await apiClient.post("/surveys/questions", payload);
    return data;
  } catch {
    return thunkAPI.rejectWithValue("Failed to create question");
  }
});

export const updateQuestion = createAsyncThunk<
  SurveyQuestion,
  {
    questionId: number;
    payload: Partial<SurveyQuestion>;
  },
  { rejectValue: string }
>("surveys/updateQuestion", async ({ questionId, payload }, thunkAPI) => {
  try {
    const { data } = await apiClient.patch(
      `/surveys/questions/${questionId}`,
      payload,
    );
    return data;
  } catch {
    return thunkAPI.rejectWithValue("Failed to update question");
  }
});

export const deleteQuestion = createAsyncThunk<
  SurveyQuestion,
  number,
  { rejectValue: string }
>("surveys/deleteQuestion", async (questionId, thunkAPI) => {
  try {
    const { data } = await apiClient.delete(`/surveys/questions/${questionId}`);
    return data;
  } catch {
    return thunkAPI.rejectWithValue("Failed to delete question");
  }
});

export const fetchSurveyByToken = createAsyncThunk<
  SurveyDetails,
  { surveyToken: string; page: number },
  { rejectValue: string }
>("surveys/fetchSurveyByToken", async ({ surveyToken, page }, thunkAPI) => {
  try {
    const { data } = await apiClient.get(
      `/surveys/${surveyToken}?page=${page}&limit=1`,
    );
    return data;
  } catch {
    return thunkAPI.rejectWithValue("Invalid survey token");
  }
});

export const submitSurvey = createAsyncThunk<
  SubmitSurveyResponse,
  {
    surveyToken: string;
    answers: SurveyAnswer[];
  },
  { rejectValue: string }
>("surveys/submitSurvey", async (payload, thunkAPI) => {
  try {
    const { data } = await apiClient.post("/surveys/submit", payload);
    return data;
  } catch {
    return thunkAPI.rejectWithValue("Failed to submit survey");
  }
});
