import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/model/slice";
import { surveysReducer } from "../redux/surveys/slice";
import { dashboardReducer } from "../redux/dashboard/slice";
import { teamReducer } from "../redux/teams/slice";
import { profileReducer } from "../redux/profile/slice";
import { commentsReducer } from "../redux/comments/slice";
import { alertsReducer } from "../redux/alerts/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    surveys: surveysReducer,
    dashboard: dashboardReducer,
    team: teamReducer,
    profile: profileReducer,
    comments: commentsReducer,
    alerts: alertsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
