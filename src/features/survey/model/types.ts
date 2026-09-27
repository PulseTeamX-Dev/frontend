export interface SurveyAnswer {
  questionId: number;
  value: number | string;
}

export interface SurveyCondition {
  field: string;
  value: number;
  operator: string;
}

export interface SurveyScale {
  scale_id: number;
  name: string;
  min_value: number;
  max_value: number;
  scale_type: "linear" | string;
  min_label_ua: string;
  mid_label_ua: string | null;
  max_label_ua: string;
  color_direction: "red_to_green" | "green_to_red" | "centered";
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
  scale_id: number | null;
  scale: SurveyScale | null;
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
