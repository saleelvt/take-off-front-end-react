/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { URL, config, createAxiosConfig } from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const axiosIn = axios.create({
  baseURL: URL,
})

// Add Founder Profile
export const adminAddFounderProfileAction = createAsyncThunk(
  "admin/FounderProfile",
  async (Datas: FormData, { rejectWithValue }) => {
    try {
      console.log("this for FounderProfile ", Datas);
      const response = await axiosIn.post(`/admin/add-founderProfile`, Datas, createAxiosConfig(true));
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);

// Get Founder Profile By Id
export const adminGetFounderProfileById = createAsyncThunk(
  "admin/getFounderProfileById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosIn.get(`/admin/get-founderProfile/${id}`, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);

// Get Founder Profiles
export const adminGetFounderProfiles = createAsyncThunk(
  "admin/adminGetFounderProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosIn.get(`/admin/get-founderProfiles`, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);

// Delete Founder Profile By Id
export const adminDeleteFounderProfileById = createAsyncThunk(
  "admin/deleteFounderProfileById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosIn.delete(`/admin/delete-founderProfile/${id}`, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);

// Update Founder Profile
export const adminUpdateFounderProfile = createAsyncThunk(
  "admin/adminUpdateFounderProfile",
  async ({ id, data }: { id: any; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await axiosIn.put(`/admin/update-founderProfile/${id}`, data, createAxiosConfig(true));
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);
