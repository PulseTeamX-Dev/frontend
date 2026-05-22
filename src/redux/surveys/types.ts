export interface SurveyAnswer {
  questionId: string;
  value: number | string;
}

export interface SurveyState {
  answers: SurveyAnswer[];
  personalHash: string | null;
  isSubmitting: boolean;
}
