/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth/authSlice";

import { userLanguageSlice } from "./reducers/auth/authSlice";
import { adminLanguageSlice } from "./reducers/admin/adminLanguage";
import MemberSlice from "./reducers/admin/admin-VerifiedMember";
import EventSlice from "./reducers/admin/admin-event";
import { BannerSlice } from "./reducers/admin/admin-banner";
import { FounderProfileSlice } from "./reducers/admin/admin-founderProfile";
import dashboardReducer from "./reducers/dashboard";


export const store = configureStore({
    reducer:{
        auth:authSlice.reducer,
        userLanguage:userLanguageSlice.reducer,
        adminLanguage:adminLanguageSlice.reducer,
        member:MemberSlice.reducer,
        event:EventSlice.reducer,
        banner:BannerSlice.reducer,
        founderProfile:FounderProfileSlice.reducer,
        dashboard:dashboardReducer
       
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export type ExtendedAppDispatch = (action: any) => any;
export default store;