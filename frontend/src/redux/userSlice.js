import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
  name: 'isLogin',
  initialState: {
    value: false,
  },
  reducers: {
    LogIn: (state, action) => {
      state.value = action.payload;
    },
    LogOut: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { LogIn, LogOut } = UserSlice.actions;
export default UserSlice.reducer;
