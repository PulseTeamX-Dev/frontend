import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/slice";
import { surveysReducer } from "./surveys/slice";
import { dashboardReducer } from "./dashboard/slice";
import { teamReducer } from "./teams/slice";
import { profileReducer } from "./profile/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    surveys: surveysReducer,
    dashboard: dashboardReducer,
    team: teamReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
