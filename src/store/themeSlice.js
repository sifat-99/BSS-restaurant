import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('appTheme');
  return savedTheme || 'spicy';
};

const initialState = {
  themeName: getInitialTheme(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeName: (state, action) => {
      state.themeName = action.payload;
      localStorage.setItem('appTheme', action.payload);
    },
  },
});

export const { setThemeName } = themeSlice.actions;
export default themeSlice.reducer;
