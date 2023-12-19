import { configureStore } from "@reduxjs/toolkit";
import { alertSlice } from "./features/alertSlice";
import { userSlice } from "./features/userSlice";
// import subscriptionSlice from "./features/subscriptionSlice";
import subscriptionReducer from "./features/subscriptionSlice";

export default configureStore({
  reducer: {
    alerts: alertSlice.reducer,
    user: userSlice.reducer,
    subscription: subscriptionReducer,
  },
});
