import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  themeName: 'spicy',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeName: (state, action) => {
      state.themeName = action.payload;
    },
  },
});

export const { setThemeName } = themeSlice.actions;
export default themeSlice.reducer;
