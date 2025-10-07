import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { useSelector } from "react-redux";
import { RootState } from "./reduxKit/store";
import { Toaster } from 'react-hot-toast';




import SignIn from "./pages/AuthPages/SignIn";
import EnquiredMembersList from "./pages/membership/listEnquiredMembers";

 

import NotFound from "./pages/OtherPage/NotFound";
import AddVerifiedMember from "./pages/verifiedMembers/add-member";
import GetVerifiedMember from "./pages/verifiedMembers/list-member";
import AddEvent from "./pages/Event/add-event";
import ListEvent from "./pages/Event/list-events";
import AddBanner from "./pages/Banner/add-banner";
import ListBanner from "./pages/Banner/list-banner";
import AddFounderProfile from "./pages/Founders-Profile/add-founderProfile";
import ListFounderProfile from "./pages/Founders-Profile/list-founderProfile";
import AdminDashboard from "./pages/Dashboard/Home";



export const App: React.FC = React.memo(() => {
  const { isLogged, role } = useSelector((state: RootState) => state.auth);
  console.log("Logged & Role:-", isLogged, role); 

  return (
    <Router>
      <ScrollToTop />
         <Toaster position="top-center" />


      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<SignIn />} />

        {/* Protected Routes inside AppLayout */}
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={isLogged ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-member"
            element={isLogged ? <AddVerifiedMember /> : <Navigate to="/login" />}
          />
          <Route
            path="/get-members"
            element={isLogged ? <GetVerifiedMember /> : <Navigate to="/login" />}
          />
        
          <Route
            path="/membership-list"
            element={isLogged ? <EnquiredMembersList /> : <Navigate to="/login" />}
          /> 
          <Route
            path="/add-event"
            element={isLogged ? <AddEvent /> : <Navigate to="/login" />}
          />
          <Route
            path="/list-events"
            element={isLogged ? <ListEvent /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-banner"
            element={isLogged ? <AddBanner /> : <Navigate to="/login" />}
          />
          <Route
            path="/list-banner"
            element={isLogged ? <ListBanner /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-founderProfile"
            element={isLogged ? <AddFounderProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/list-founderProfile"
            element={isLogged ? <ListFounderProfile /> : <Navigate to="/login" />}
          />
        
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
});

export default App;
