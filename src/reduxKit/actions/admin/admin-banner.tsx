/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { URL, config, createAxiosConfig } from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const axiosIn = axios.create({
  baseURL: URL,
});

// Add Banner
export const adminAddBannerAction = createAsyncThunk(
  "admin/Banner",
  async (Datas: FormData, { rejectWithValue }) => {
    try {
      console.log("this for Banner ", Datas);
      const response = await axiosIn.post(`/admin/add-banner`, Datas, createAxiosConfig(true));
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);

// Get Banner By Id
export const adminGetBannerById = createAsyncThunk(
  "admin/getBannerById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosIn.get(`/admin/get-banner/${id}`, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);
// Get Banners
export const adminGetBanners = createAsyncThunk(
  "admin/adminGetBanner",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosIn.get(`/admin/get-banner`, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);



// Delete Banner By Id
export const adminDeleteBannerById = createAsyncThunk(
  "admin/deleteBannerById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosIn.delete(`/admin/delete-banner/${id}`, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);

// Update Banner
export const adminUpdateBanner = createAsyncThunk(
  "admin/adminUpdateBanner",
  async ({ id, data }: { id: any; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await axiosIn.put(`/admin/update-banner/${id}`, data,  createAxiosConfig(true));
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);
