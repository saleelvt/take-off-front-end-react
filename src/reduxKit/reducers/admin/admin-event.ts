/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { adminAddEventAction } from "../../actions/admin/admin-event";

export interface EventState {
  eventData: any | null;
  error: string | null;
  loading: boolean;
  events: any[];
  message: string | null;
}

const initialState: EventState = {
  eventData: null,
  error: null,
  loading: false,
  events: [],
  message: null,
};

export const EventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    updateError: (state, { payload }) => {
      state.error = payload;
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    resetEventState: (state) => {
      state.eventData = null;
      state.error = null;
      state.loading = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminAddEventAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(adminAddEventAction.fulfilled, (state, { payload }) => {
        console.log("Event creation payload:", payload);
        state.loading = false;
        state.error = null;
        state.eventData = payload;
        state.message = "Event added successfully!";

        // Add the new event to the events array if it exists
        if (payload && payload.event) {
          state.events.push(payload.event);
        }
      })
      .addCase(adminAddEventAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.eventData = null;
        state.error = payload as string;
        state.message = null;
      });
  },
});

export const { updateError, clearMessage, resetEventState } = EventSlice.actions;
export default EventSlice;
