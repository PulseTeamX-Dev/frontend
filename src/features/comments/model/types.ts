export interface Comment {
  response_id: number;
  survey_id: number;
  team_id: number;
  team_name: string;
  anonymous_comment: string;
  created_at: string;
}

export interface CommentsPagination {
  current_page: number;
  limit: number;
  total_comments: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: CommentsPagination;
}

export interface CommentsState {
  items: Comment[];
  pagination: CommentsPagination | null;
  isLoading: boolean;
  error: string | null;
}
