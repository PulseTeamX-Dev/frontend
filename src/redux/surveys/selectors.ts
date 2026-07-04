import type { RootState } from "@/app/store";

export const selectQuestions = (state: RootState) => state.surveys.questions;

export const selectCurrentSurvey = (state: RootState) =>
  state.surveys.currentSurvey;

export const selectSurveyAnswers = (state: RootState) => state.surveys.answers;

export const selectSurveyLoading = (state: RootState) =>
  state.surveys.isLoading;

export const selectSurveySubmitting = (state: RootState) =>
  state.surveys.isSubmitting;

export const selectSurveyError = (state: RootState) => state.surveys.error;
