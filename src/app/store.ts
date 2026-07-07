import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/model/slice";
import { surveysReducer } from "../features/survey/model/slice";
import { dashboardReducer } from "../features/dashboard/model/slice";
import { teamReducer } from "../features/teams/model/slice";
import { profileReducer } from "../features/profile/model/slice";
import { commentsReducer } from "../features/comments/model/slice";
import { alertsReducer } from "../features/alerts/model/slice";

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
