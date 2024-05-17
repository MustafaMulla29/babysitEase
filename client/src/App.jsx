import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "./components/Spinner";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import { Slide, ToastContainer } from "react-toastify";
import Subscription from "./pages/Subscription";
import { StyledEngineProvider } from "@mui/material";
import Notification from "./pages/Notification";
import { useEffect } from "react";
import ApplyNurse from "./pages/ApplyNurse";
import Users from "./pages/admin/Users";
import Caregivers from "./pages/admin/Caregivers";
import UserProfile from "./pages/client/Profile";
import CaregiverDetails from "./pages/client/CaregiverDetails";
import Bookings from "./pages/client/Bookings";
import CaregiverBookings from "./pages/caregiver/Bookings";
import axios from "axios";
import SearchPage from "./pages/client/SearchPage";
import Homepage from "./pages/Homepage";
import ScrollTop from "./components/ScrollTop";
import PageNotFound from "./components/PageNotFound";
import AlertComponent from "./components/AlertComponent";
import { closeAlert } from "./redux/features/messageSlice";
import { ThemeProvider } from "@emotion/react";
import Theme from "./components/Theme";
import FavouritedCaregiver from "./pages/client/FavouritedCaregiver";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const { user } = useSelector((state) => state.user);
  const { open, severity, content } = useSelector((state) => state.message);
  // const { isSubscribed } = useSelector((state) => state.subscription);
  const user_id = user?._id;

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

  // const changeSubscriptionStatus = useCallback(async () => {
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:8070/api/v1/caregiver/changeSubscriptionStatus/${user_id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     if (res.data.success) {
  //       if (res.data.data.subscriptionStatus === "Expired") {
  //         // dispatch(resetSubscription());
  //         localStorage.setItem(
  //           "subscriptionStatus",
  //           res.data.data.subscriptionStatus
  //         );
  //       }
  //     } else {
  //       // dispatch(setSubscribed());
  //       localStorage.setItem(
  //         "subscriptionStatus",
  //         res.data.data.subscriptionStatus
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [user_id]);

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8070/api/v1/caregiver/checkSubscription/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        // dispatch(setSubscribed());
        localStorage.setItem("subscriptionStatus", "Active");
        console.log("if part", res.data.message);
      }
      if (!res.data.success) {
        // dispatch(resetSubscription());
        localStorage.setItem("subscriptionStatus", "Expired");
        console.log("else part", res.data.message);
      }
    } catch (error) {
      if (!error.response.data.success) {
        localStorage.setItem("subscriptionStatus", "Expired");
      }
      console.log(error);
    }
  };

  const subscriptionStatus = localStorage.getItem("subscriptionStatus");

  // useEffect(() => {

  // if (subscriptionStatus === "Active") {
  //   dispatch(setSubscribed());
  // }

  // if (subscriptionStatus === "Expired") {
  //   dispatch(resetSubscription());
  // }
  // }, [user, checkSubscription]);

  // useEffect(() => {
  // Check subscription status after component mounts
  if (user?.role !== "client" && user?.role !== "admin") {
    // changeSubscriptionStatus();
    checkSubscription();
  }
  // }, [checkSubscription, user?.role]);
  return (
    <>
      <ThemeProvider theme={Theme}>
        <StyledEngineProvider injectFirst>
          {open && (
            <AlertComponent
              severity={severity}
              onClose={() => dispatch(closeAlert())}
              content={content}
            />
          )}

          <BrowserRouter>
            <ToastContainer
              position="top-center"
              transition={Slide}
              autoClose={2000}
              // className="w-full"
            />
            {loading ? (
              <Spinner />
            ) : (
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoutes>
                      {user?.role === "client" ? (
                        <Homepage />
                      ) : (user?.role === "babysitter" ||
                          user?.role === "nurse") &&
                        user?.isCaregiver &&
                        subscriptionStatus === "Expired" ? (
                        <Navigate to="/subscribe" replace={true} />
                      ) : (
                        <Homepage />
                      )}
                    </ProtectedRoutes>
                  }
                />
                {/* <Route
                    path="/"
                    element={
                      <ProtectedRoutes>
                        <Homepage />
                      </ProtectedRoutes>
                    }
                  /> */}
                <Route
                  path="/login"
                  element={
                    <PublicRoutes>
                      <Login />
                    </PublicRoutes>
                  }
                />
                {/* TODO: HAVE TO CREATE A NO PERMISSION TO ACCESS ROUTE COMPONENT  */}
                <Route
                  path="/apply-nurse"
                  element={
                    <ProtectedRoutes>
                      {user?.role !== "client" ? (
                        <ApplyNurse />
                      ) : (
                        <PageNotFound />
                      )}
                    </ProtectedRoutes>
                  }
                />
                {/* TODO: HAVE TO CREATE A NO PERMISSION TO ACCESS ROUTE COMPONENT  */}
                <Route
                  path="/apply-babysitter"
                  element={
                    <ProtectedRoutes>
                      {user?.role !== "client" ? (
                        <ApplyNurse />
                      ) : (
                        <PageNotFound />
                      )}
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
                  path={`/client/favourites/:id`}
                  element={
                    <ProtectedRoutes>
                      <FavouritedCaregiver />
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

                <Route path="*" element={<PageNotFound />} />
              </Routes>
            )}
            <ScrollTop />
          </BrowserRouter>
        </StyledEngineProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
