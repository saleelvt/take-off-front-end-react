/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { 
  adminAddBannerAction, 
  adminGetBanners, 
  adminGetBannerById, 
  adminDeleteBannerById, 
  adminUpdateBanner 
} from "../../actions/admin/admin-banner";

export interface BannerState {
  bannerData: any | null;
  error: string | null;
  loading: boolean;
  banners: any[];
  message: string | null;
}

const initialState: BannerState = {
  bannerData: null,
  error: null,
  loading: false,
  banners: [],
  message: null,
};

export const BannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    updateError: (state, { payload }) => {
      state.error = payload;
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    resetBannerState: (state) => {
      state.bannerData = null;
      state.error = null;
      state.loading = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Banner
      .addCase(adminAddBannerAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(adminAddBannerAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.bannerData = payload;
        state.message = "Banner added successfully!";
        if (payload && payload.banner) {
          state.banners.push(payload.banner);
        }
      })
      .addCase(adminAddBannerAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.bannerData = null;
        state.error = payload as string;
        state.message = null;
      })

      // Get Banners
      .addCase(adminGetBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminGetBanners.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.banners = payload?.banners || [];
      })
      .addCase(adminGetBanners.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // Get Banner By Id
      .addCase(adminGetBannerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminGetBannerById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bannerData = payload;
      })
      .addCase(adminGetBannerById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // Delete Banner By Id
      .addCase(adminDeleteBannerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeleteBannerById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = "Banner deleted successfully!";
        // Optionally remove deleted banner from banners array
        if (payload?.id) {
          state.banners = state.banners.filter(b => b.id !== payload.id);
        }
      })
      .addCase(adminDeleteBannerById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // Update Banner
      .addCase(adminUpdateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminUpdateBanner.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = "Banner updated successfully!";
        state.bannerData = payload;
        // Optionally update banner in banners array
        if (payload?.id) {
          const index = state.banners.findIndex(b => b.id === payload.id);
          if (index !== -1) state.banners[index] = payload;
        }
      })
      .addCase(adminUpdateBanner.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export const { updateError, clearMessage, resetBannerState } = BannerSlice.actions;
export const bannerReducer = BannerSlice.reducer;
