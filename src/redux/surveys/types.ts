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
export interface PaginationInfo {
  current_page: number;
  limit: number;
  total_questions: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}
export interface SurveyDetails {
  survey_id: number;
  questions: SurveyQuestion[];
  pagination: PaginationInfo;
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
