import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SurveyAnswer, SurveyState } from "./types";

const initialState: SurveyState = {
  answers: [],
  personalHash: null,
  isSubmitting: false,
};

const surveysSlice = createSlice({
  name: "surveys",
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<SurveyAnswer>) => {
      const index = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId,
      );
      if (index !== -1) {
        state.answers[index] = action.payload;
      } else {
        state.answers.push(action.payload);
      }
    },
    clearSurveyForm: (state) => {
      state.answers = [];
    },
  },
});

export const { setAnswer, clearSurveyForm } = surveysSlice.actions;
export const surveysReducer = surveysSlice.reducer;
