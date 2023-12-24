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
import { resetSubscription } from "./redux/features/subscriptionSlice";
import ApplyNurse from "./pages/ApplyNurse";
import Users from "./pages/admin/Users";
import Caregivers from "./pages/admin/Caregivers";
import Profile from "./pages/caregiver/Profile";
import UserProfile from "./pages/client/Profile";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  // changes made here 04-08-2023
  //from useSubscription custom hook
  const isSubscribed = useSelector((state) => state.subscription.isSubscribed);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // Reset subscription status when the component mounts
    dispatch(resetSubscription());
  }, [dispatch]);

  useEffect(() => {
    const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 100;

    const timeoutId = setTimeout(() => {
      dispatch(resetSubscription());
      localStorage.removeItem("subscriptionStatus"); // Remove from local storage
    }, thirtyDaysInMillis);

    return () => clearTimeout(timeoutId);
  }, [dispatch, isSubscribed]);
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
                    {localStorage.getItem("subscriptionStatus") ? (
                      <HomePage />
                    ) : user?.role === "babysitter" ||
                      user?.role === "nurse" ? (
                      <Navigate to="/subscribe" replace={true} />
                    ) : (
                      <HomePage />
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
                path={`/nurse/profile/:id`}
                element={
                  <ProtectedRoutes>
                    <Profile />
                  </ProtectedRoutes>
                }
              />
              <Route
                path={`/babysitter/profile/:id`}
                element={
                  <ProtectedRoutes>
                    <Profile />
                  </ProtectedRoutes>
                }
              />
              <Route
                path={`/client/profile/:id`}
                element={
                  <ProtectedRoutes>
                    <UserProfile />
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
