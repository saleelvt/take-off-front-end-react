/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { adminAddVerifiedMemberAction } from "../../actions/admin/admin-verified-member";

export interface MemberState {
  memberData: any | null;
  error: string | null;
  loading: boolean;
  members: any[];
  message: string | null;
}

const initialState: MemberState = {
  memberData: null,
  error: null,
  loading: false,
  members: [],
  message: null,
};

export const MemberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    updateError: (state, { payload }) => {
      state.error = payload;
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    resetMemberState: (state) => {
      state.memberData = null;
      state.error = null;
      state.loading = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminAddVerifiedMemberAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(adminAddVerifiedMemberAction.fulfilled, (state, { payload }) => {
        console.log("Member creation payload:", payload);
        state.loading = false;
        state.error = null;
        state.memberData = payload;
        state.message = "Member added successfully!";

        // Add the new member to members array if it exists
        if (payload && payload.member) {
          state.members.push(payload.member);
        }
      })
      .addCase(adminAddVerifiedMemberAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.memberData = null;
        state.error = payload as string;
        state.message = null;
      });
  },
});

export const { updateError, clearMessage, resetMemberState } = MemberSlice.actions;
export default MemberSlice;
