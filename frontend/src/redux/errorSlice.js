import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
  name: 'isLogin',
  initialState: {
    value: false,
    message: '',
  },
  reducers: {
    showError: (state, action) => {
      state.value = true;
      state.message = action.payload;
    },
    hideError: (state, action) => {
      state.value = false;
      setTimeout(() => {
        
      }, 5000);
    },
  },
});

export const { showError, hideError } = UserSlice.actions;
export default UserSlice.reducer;
