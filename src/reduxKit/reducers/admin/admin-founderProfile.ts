/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { 
  adminAddFounderProfileAction, 
  adminGetFounderProfiles, 
  adminGetFounderProfileById, 
  adminDeleteFounderProfileById, 
  adminUpdateFounderProfile 
} from "../../actions/admin/admin-founderProfile";

export interface FounderProfileState {
  founderProfileData: any | null;
  error: string | null;
  loading: boolean;
  founderProfiles: any[];
  message: string | null;
}

const initialState: FounderProfileState = {
  founderProfileData: null,
  error: null,
  loading: false,
  founderProfiles: [],
  message: null,
};

export const FounderProfileSlice = createSlice({
  name: "founderProfile",
  initialState,
  reducers: {
    updateError: (state, { payload }) => {
      state.error = payload;
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    resetFounderProfileState: (state) => {
      state.founderProfileData = null;
      state.error = null;
      state.loading = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Founder Profile
      .addCase(adminAddFounderProfileAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(adminAddFounderProfileAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.founderProfileData = payload;
        state.message = "Founder profile added successfully!";
        if (payload && payload.founderProfile) {
          state.founderProfiles.push(payload.founderProfile);
        }
      })
      .addCase(adminAddFounderProfileAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.founderProfileData = null;
        state.error = payload as string;
        state.message = null;
      })

      // Get Founder Profiles
      .addCase(adminGetFounderProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminGetFounderProfiles.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.founderProfiles = payload?.founderProfiles || [];
      })
      .addCase(adminGetFounderProfiles.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // Get Founder Profile By Id
      .addCase(adminGetFounderProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminGetFounderProfileById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.founderProfileData = payload;
      })
      .addCase(adminGetFounderProfileById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // Delete Founder Profile By Id
      .addCase(adminDeleteFounderProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeleteFounderProfileById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = "Founder profile deleted successfully!";
        // Optionally remove deleted founder profile from founderProfiles array
        if (payload?.id) {
          state.founderProfiles = state.founderProfiles.filter(fp => fp.id !== payload.id);
        }
      })
      .addCase(adminDeleteFounderProfileById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // Update Founder Profile
      .addCase(adminUpdateFounderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminUpdateFounderProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = "Founder profile updated successfully!";
        state.founderProfileData = payload;
        // Optionally update in founderProfiles array
        if (payload?.id) {
          const index = state.founderProfiles.findIndex(fp => fp.id === payload.id);
          if (index !== -1) state.founderProfiles[index] = payload;
        }
      })
      .addCase(adminUpdateFounderProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export const { updateError, clearMessage, resetFounderProfileState } = FounderProfileSlice.actions;
export const founderProfileReducer = FounderProfileSlice.reducer;
