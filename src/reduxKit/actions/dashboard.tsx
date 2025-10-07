
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { URL,config } from "../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const axiosIn = axios.create({
  baseURL: URL,
});


export const adminGetDashboard = createAsyncThunk(
  "adminGEtDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosIn.get(`/admin/get-dashboard`, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);
