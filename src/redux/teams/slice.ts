import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TeamState } from "./types";

import {
  fetchTeams,
  createTeam,
  rotateTeamToken,
  addMember,
  archiveMember,
  archiveTeam,
  importTeamEmails,
} from "./operation";

const initialState: TeamState = {
  teams: [],
  currentTeam: null,
  members: [],
  importCount: null,
  isLoading: false,
  error: null,
};

const handlePending = (state: TeamState) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (
  state: TeamState,
  action: PayloadAction<string | undefined>,
) => {
  state.isLoading = false;
  state.error = action.payload ?? "Something went wrong";
};

const teamSlice = createSlice({
  name: "team",
  initialState,

  reducers: {
    clearTeamData: (state) => {
      state.currentTeam = null;
      state.members = [];
      state.teams = [];
      state.importCount = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // fetchTeams
      .addCase(fetchTeams.pending, handlePending)
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, handleRejected)

      // createTeam
      .addCase(createTeam.pending, handlePending)
      .addCase(createTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams.push(action.payload);
      })
      .addCase(createTeam.rejected, handleRejected)

      // rotateTeamToken
      .addCase(rotateTeamToken.pending, handlePending)
      .addCase(rotateTeamToken.fulfilled, (state, action) => {
        state.isLoading = false;

        const team = state.teams.find(
          (t) => t.team_id === action.payload.team_id,
        );

        if (team) {
          team.team_token = action.payload.team_token;
        }
      })
      .addCase(rotateTeamToken.rejected, handleRejected)

      // addMember
      .addCase(addMember.pending, handlePending)
      .addCase(addMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members.push(action.payload);
      })
      .addCase(addMember.rejected, handleRejected)

      // archiveMember
      .addCase(archiveMember.pending, handlePending)
      .addCase(archiveMember.fulfilled, (state, action) => {
        state.isLoading = false;

        const member = state.members.find(
          (m) => m.user_id === action.payload.user_id,
        );

        if (member) {
          member.is_active = false;
        }
      })
      .addCase(archiveMember.rejected, handleRejected)

      // archiveTeam
      .addCase(archiveTeam.pending, handlePending)
      .addCase(archiveTeam.fulfilled, (state, action) => {
        state.isLoading = false;

        const team = state.teams.find(
          (t) => t.team_id === action.payload.team_id,
        );

        if (team) {
          team.is_active = false;
        }
      })
      .addCase(archiveTeam.rejected, handleRejected)

      // importTeamEmails
      .addCase(importTeamEmails.pending, handlePending)
      .addCase(importTeamEmails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.importCount = action.payload.count;
      })
      .addCase(importTeamEmails.rejected, handleRejected);
  },
});

export const { clearTeamData } = teamSlice.actions;
export const teamReducer = teamSlice.reducer;
