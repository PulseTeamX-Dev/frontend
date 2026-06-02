export interface SurveyAnswer {
  questionId: number;
  value: number | string;
}

export interface SurveyCondition {
  field: string;
  value: number;
  operator: string;
}

export interface SurveyQuestion {
  question_id: number;
  field_key: string | null;
  text_ua: string;
  question_type: "scale" | "text";
  sort_order: number;
  conditional: SurveyCondition | null;
  is_active: boolean;
  created_at: string;
}

export interface SurveyDetails {
  survey_id: number;
  questions: SurveyQuestion[];
}

export interface SubmitSurveyResponse {
  success: boolean;
  responseId: number;
}

export interface SurveyState {
  questions: SurveyQuestion[];
  currentSurvey: SurveyDetails | null;
  answers: SurveyAnswer[];
  personalHash: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}
