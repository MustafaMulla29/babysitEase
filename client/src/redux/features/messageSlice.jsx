// alertSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  severity: "success",
  content: "",
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    openAlert: (state, action) => {
      state.open = true;
      state.severity = action.payload.severity || "success";
      state.content = action.payload.content || "";
    },
    closeAlert: (state) => {
      state.open = false;
    },
  },
});

export const { openAlert, closeAlert } = messageSlice.actions;
export const selectAlert = (state) => state.alert;
export default messageSlice.reducer;
