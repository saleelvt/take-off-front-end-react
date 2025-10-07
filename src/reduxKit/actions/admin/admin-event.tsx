/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { URL, config, createAxiosConfig } from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const axiosIn = axios.create({
  baseURL: URL,
});

// Add Event
export const adminAddEventAction = createAsyncThunk(
  "admin/Event",
  async (Datas: FormData, { rejectWithValue }) => {
    try {
      console.log("this for Event ", Datas);
      const response = await axiosIn.post(`/admin/add-event`, Datas, createAxiosConfig(true));
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);

// Get Events
export const adminGetEvents = createAsyncThunk(
  "admin/adminGetEvent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosIn.get(`/admin/get-events`, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);

// Get Event By Id
export const adminGetEventById = createAsyncThunk(
  "admin/getEventById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosIn.get(`/admin/get-event/${id}`, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);

// Delete Event By Id
export const adminDeleteEventById = createAsyncThunk(
  "admin/deleteEventById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosIn.delete(`/admin/delete-event/${id}`, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);

// Update Event
export const adminUpdateEvent = createAsyncThunk(
  "admin/adminUpdateEvent",
  async ({ id, data }: { id: any; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await axiosIn.put(`/admin/update-eventById/${id}`, data, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);
