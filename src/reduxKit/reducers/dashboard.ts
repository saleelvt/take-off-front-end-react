/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adminGetDashboard } from "../actions/dashboard";

interface Totals {
  banners: number;
  events: number;
  founderProfiles: number;
  memberships: number;
  verifiedMemberships: number;
}

interface Summary {
  totalRecords: number;
  lastUpdated: string;
}

interface DashboardData {
  totals: Totals;
  summary: Summary;
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: {
    message: string;
  } | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboard: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminGetDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        adminGetDashboard.fulfilled,
        (state, action: PayloadAction<DashboardData>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(adminGetDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;