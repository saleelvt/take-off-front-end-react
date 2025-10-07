/* eslint-disable @typescript-eslint/no-explicit-any */
import axios  from "axios";
import { URL,config ,createAxiosConfig} from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const axiosIn = axios.create({
    baseURL: URL,
  });


  export const adminAddMembershipAction= createAsyncThunk(
    "admin/Membership",
    async (Datas:FormData,{rejectWithValue})=>{
        try {
            console.log("this  for Membership ",Datas);
            const response = await axiosIn.post(`/admin/add-membership`, Datas,createAxiosConfig(true));
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


    export const adminGetMemberships= createAsyncThunk(
      "admin/adminGetMembership",
      async (_,{rejectWithValue})=>{
          try {
              const response = await axiosIn.get(`/admin/get-membership`,config);
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
    export const adminGetMembershipById= createAsyncThunk(
      "admin/getMembershipById",
      async (id:string,{rejectWithValue})=>{
          try {
              const response = await axiosIn.get(`/admin/get-membershipById/${id}`,config);
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
    
    export const adminDeleteMembershipById= createAsyncThunk(
      "admin/deleteMembershipById",
      async (id:string,{rejectWithValue})=>{
          try {
              const response = await axiosIn.delete(`/admin/delete-membershipById/${id}`,config);
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

    export const adminUpdateMembership= createAsyncThunk(
      "admin/adminUpdateMembership",
      async ( { id, data }:{ id: any; data: FormData  },{rejectWithValue})=>{
          try {
              const response = await axiosIn.put(`/admin/update-membershipById/${id}`, data,config);
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
  
  
    
    