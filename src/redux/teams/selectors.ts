import type { RootState } from "../store";

export const selectTeams = (state: RootState) => state.team.teams;

export const selectCurrentTeam = (state: RootState) => state.team.currentTeam;

export const selectTeamMembers = (state: RootState) => state.team.members;

export const selectTeamLoading = (state: RootState) => state.team.isLoading;

export const selectTeamError = (state: RootState) => state.team.error;

export const selectImportCount = (state: RootState) => state.team.importCount;
