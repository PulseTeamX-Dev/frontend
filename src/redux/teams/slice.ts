import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TeamState, TeamInfo, TeamMember } from "./types";

const initialState: TeamState = {
  currentTeam: null,
  members: [],
  isLoading: false,
  error: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setCurrentTeam: (state, action: PayloadAction<TeamInfo>) => {
      state.currentTeam = action.payload;
    },
    setTeamMembers: (state, action: PayloadAction<TeamMember[]>) => {
      state.members = action.payload;
    },
    updateMemberStatus: (
      state,
      action: PayloadAction<{ user_id: string; is_active: boolean }>,
    ) => {
      const member = state.members.find(
        (m) => m.user_id === action.payload.user_id,
      );
      if (member) {
        member.is_active = action.payload.is_active;
      }
    },
    clearTeamData: (state) => {
      state.currentTeam = null;
      state.members = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentTeam,
  setTeamMembers,
  updateMemberStatus,
  clearTeamData,
  setLoading,
  setError,
} = teamSlice.actions;

export const teamReducer = teamSlice.reducer;
