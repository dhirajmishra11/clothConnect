import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Load user from localStorage
  token: localStorage.getItem("token") || null, // Load token from localStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user)); // Save user to localStorage
      localStorage.setItem("token", action.payload.token); // Save token to localStorage
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user"); // Remove user from localStorage
      localStorage.removeItem("token"); // Remove token from localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
