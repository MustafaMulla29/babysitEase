import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "./components/Spinner";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import { ToastContainer } from "react-toastify";
import Subscription from "./pages/Subscription";
import { StyledEngineProvider } from "@mui/material";
import Notification from "./pages/Notification";
import { useEffect } from "react";
import {
  resetSubscription,
  setSubscribed,
} from "./redux/features/subscriptionSlice";
import ApplyNurse from "./pages/ApplyNurse";
import Users from "./pages/admin/Users";
import Caregivers from "./pages/admin/Caregivers";
// import Profile from "./pages/caregiver/Profile";
import UserProfile from "./pages/client/Profile";
import CaregiverDetails from "./pages/client/CaregiverDetails";
import Bookings from "./pages/client/Bookings";
import CaregiverBookings from "./pages/caregiver/Bookings";
import axios from "axios";
import HomePageNew from "./pages/HomePageNew";
import SearchPage from "./pages/client/SearchPage";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  // changes made here 04-08-2023
  //from useSubscription custom hook
  // const isSubscribed = useSelector((state) => state.subscription.isSubscribed);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // Reset subscription status when the component mounts
    dispatch(resetSubscription());
  }, [dispatch]);

  // useEffect(() => {
  //   const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 100;

  //   const timeoutId = setTimeout(() => {
  //     dispatch(resetSubscription());
  //     localStorage.removeItem("subscriptionStatus"); // Remove from local storage
  //   }, thirtyDaysInMillis);

  //   return () => clearTimeout(timeoutId);
  // }, [dispatch, isSubscribed]);

  useEffect(() => {
    const bookingStatus = async () => {
      try {
        await axios.post(
          "http://localhost:8070/api/v1/caregiver/bookingStatus",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        return;
      }
    };
    bookingStatus();
  }, []);

  useEffect(() => {
    const changeSubscriptionStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8070/api/v1/caregiver/changeSubscriptionStatus/${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          localStorage.setItem(
            "subscriptionStatus",
            res.data.data.subscriptionStatus
          );
          dispatch(resetSubscription());
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user?.role !== "client") changeSubscriptionStatus();
  }, [dispatch, user]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8070/api/v1/caregiver/checkSubscription/${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          localStorage.setItem(
            "subscriptionStatus",
            res.data.data.subscriptionStatus
          );
          dispatch(setSubscribed());
        } else {
          localStorage.setItem(
            "subscriptionStatus",
            res.data.data.subscriptionStatus
          );
          dispatch(resetSubscription());
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user?.role !== "client") checkSubscription();
  }, [dispatch, user]);

  return (
    <>
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <ToastContainer />
          {loading ? (
            <Spinner />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoutes>
                    {localStorage.getItem("subscriptionStatus") === "Active" ? (
                      <HomePageNew />
                    ) : user?.role === "babysitter" ||
                      user?.role === "nurse" ? (
                      <Navigate to="/subscribe" replace={true} />
                    ) : (
                      // <HomePage />
                      <HomePageNew />
                    )}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoutes>
                    <Login />
                  </PublicRoutes>
                }
              />
              <Route
                path="/apply-nurse"
                element={
                  <ProtectedRoutes>
                    <ApplyNurse />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/apply-babysitter"
                element={
                  <ProtectedRoutes>
                    <ApplyNurse />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoutes>
                    <SearchPage />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoutes>
                    <Users />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/admin/caregivers"
                element={
                  <ProtectedRoutes>
                    <Caregivers />
                  </ProtectedRoutes>
                }
              />

              <Route
                path={`/client/:id`}
                element={
                  <ProtectedRoutes>
                    <UserProfile />
                  </ProtectedRoutes>
                }
              />
              <Route
                path={`/caregiver/:userId`}
                element={
                  <ProtectedRoutes>
                    <CaregiverDetails />
                  </ProtectedRoutes>
                }
              />
              <Route
                path={`/client/bookings`}
                element={
                  <ProtectedRoutes>
                    <Bookings />
                  </ProtectedRoutes>
                }
              />
              <Route
                path={`/caregiver/bookings`}
                element={
                  <ProtectedRoutes>
                    <CaregiverBookings />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/notification"
                element={
                  <ProtectedRoutes>
                    <Notification />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoutes>
                    <Register />
                  </PublicRoutes>
                }
              />
              {/* changes made here 04-08-2023 */}
              <Route
                path="/subscribe"
                element={
                  <ProtectedRoutes>
                    <Subscription
                    // isSubscribed={isSubscribed}
                    // setIsSubscribed={setIsSubscribed}
                    />
                  </ProtectedRoutes>
                }
              />
              {/* to here */}
            </Routes>
          )}
        </BrowserRouter>
      </StyledEngineProvider>
    </>
  );
}

export default App;
