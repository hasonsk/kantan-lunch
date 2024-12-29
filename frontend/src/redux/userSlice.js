import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
  name: 'isLogin',
  initialState: {
    value: false,
    rememberMe: false,
  },
  reducers: {
    LogIn: (state, action) => {
      state.value = action.payload.value;
      state.rememberMe = action.payload.rememberMe;
    },
    LogOut: (state, action) => {
      state.value = false;
      state.rememberMe = false;
      //Need object with attribute:  rememberMe
    },
  },
});

export const { LogIn, LogOut } = UserSlice.actions;
export default UserSlice.reducer;
