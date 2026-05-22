import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Описуємо структуру команди згідно з нашою БД
export interface Team {
  team_id: string | number;
  team_token: string;
  is_active: boolean;
  name?: string;
}

interface AdminState {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  teams: [],
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
    updateTeamStatus: (
      state,
      action: PayloadAction<{ team_id: string | number; is_active: boolean }>,
    ) => {
      const team = state.teams.find(
        (t) => t.team_id === action.payload.team_id,
      );
      if (team) {
        team.is_active = action.payload.is_active;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setTeams, updateTeamStatus, setLoading, setError } =
  adminSlice.actions;
export const adminReducer = adminSlice.reducer;
