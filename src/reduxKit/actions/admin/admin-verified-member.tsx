/* eslint-disable @typescript-eslint/no-explicit-any */
import axios  from "axios";
import { URL,config } from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const axiosIn = axios.create({
    baseURL: URL,
  });
interface GetMembersParams {
  page?: number;
  limit?: number;
}

  export const adminAddVerifiedMemberAction= createAsyncThunk(
    "admin/addVerifiedMember",
    async (Datas:FormData,{rejectWithValue})=>{
        try {
            console.log("this  for VerifiedMember ",Datas);
            const response = await axiosIn.post(`/admin/add-member`, Datas,config);
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error.response) {
              return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: "Something went wrong!" });
          }
    }
  )


   export const adminGetVerifiedMembers = createAsyncThunk(
  "admin/getVerifiedMembers",
  async (params: GetMembersParams = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const { page, limit } = params;
      const response = await axiosIn.get(`/admin/get-member?page=${page}&limit=${limit}`,config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  }
);
    export const adminGetVerifiedMemberById= createAsyncThunk(
      "admin/getVerifiedMemberById",
      async (id:string,{rejectWithValue})=>{
          try {
              const response = await axiosIn.get(`/admin/get-memberbyid/${id}`,config);
              return response.data;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              if (error.response) {
                return rejectWithValue(error.response.data);
              }
              return rejectWithValue({ message: "Something went wrong!" });
            }
      }
    ) 
    
    export const adminDeleteVerifiedMemberById= createAsyncThunk(
      "admin/deleteVerifiedMemberById",
      async (id:string,{rejectWithValue})=>{
          try {
              const response = await axiosIn.delete(`/admin/delete-member/${id}`,config);
              return response.data;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              if (error.response) {
                return rejectWithValue(error.response.data);
              }
              return rejectWithValue({ message: "Something went wrong!" });
            }
      }
    ) 

    export const adminUpdateVerifiedMember= createAsyncThunk(
      "admin/adminUpdateVerifiedMember",
      async ( { id, data }:{ id: any; data: FormData  },{rejectWithValue})=>{
          try {
              const response = await axiosIn.put(`/admin/update-member/${id}`, data,config);
              return response.data; 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              if (error.response) {
                return rejectWithValue(error.response.data);
              }
              return rejectWithValue({ message: "Something went wrong!" });
            }
      }
    )
  
  
    
    