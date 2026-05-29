import { createSlice } from "@reduxjs/toolkit";

const LS_KEY = "app_lang";

const languageSlice = createSlice({
  name: "language",
  initialState: {
    lang: localStorage.getItem(LS_KEY) || "vi",
  },
  reducers: {
    setLanguage(state, action) {
      state.lang = action.payload;
      localStorage.setItem(LS_KEY, action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const selectLang = (state) => state.language.lang;
export default languageSlice.reducer;
