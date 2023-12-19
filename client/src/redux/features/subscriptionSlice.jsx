// subscriptionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    isSubscribed: false,
  },
  reducers: {
    setSubscribed: (state) => {
      state.isSubscribed = true;
    },
    resetSubscription: (state) => {
      state.isSubscribed = false;
    },
  },
});

export const { setSubscribed, resetSubscription } = subscriptionSlice.actions;
export const selectIsSubscribed = (state) => state.subscription.isSubscribed;

export default subscriptionSlice.reducer;
