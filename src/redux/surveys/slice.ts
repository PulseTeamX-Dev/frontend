import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SurveyAnswer, SurveyState } from "./types";

import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  fetchSurveyByToken,
  submitSurvey,
} from "./operation";

const initialState: SurveyState = {
  questions: [],
  currentSurvey: null,
  answers: [],
  personalHash: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
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

  extraReducers: (builder) => {
    builder

      // fetch questions
      .addCase(fetchQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to load questions";
      })

      // create question
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload);
      })

      // update question
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex(
          (q) => q.question_id === action.payload.question_id,
        );

        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })

      // delete question
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        const question = state.questions.find(
          (q) => q.question_id === action.payload.question_id,
        );

        if (question) {
          question.is_active = false;
        }
      })

      // survey by token
      .addCase(fetchSurveyByToken.fulfilled, (state, action) => {
        state.currentSurvey = action.payload;
      })

      // submit
      .addCase(submitSurvey.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(submitSurvey.fulfilled, (state) => {
        state.isSubmitting = false;
        state.answers = [];
      })
      .addCase(submitSurvey.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload ?? "Failed to submit survey";
      });
  },
});

export const { setAnswer, clearSurveyForm } = surveysSlice.actions;
export const surveysReducer = surveysSlice.reducer;
