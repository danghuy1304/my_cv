import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyUserInfo } from "@/services/profileService";

// ============================================================
// ASYNC THUNKS — Lấy thông tin tài khoản user (/users/me)
// CV data (ảnh, kỹ năng...) nằm trong cvProfileSlice
// ============================================================

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getMyUserInfo(); // đã unwrap response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || "Lấy thông tin thất bại",
      );
    }
  },
);

// ============================================================
// STATE KHỞI TẠO
// ============================================================
const initialState = {
  data: null, // Thông tin profile của user
  isLoading: false, // Trạng thái loading khi gọi API
  error: null, // Thông báo lỗi nếu có
};

// ============================================================
// PROFILE SLICE
// ============================================================
const profileSlice = createSlice({
  name: "profile",
  initialState,

  // --- REDUCERS ĐỒNG BỘ ---
  reducers: {
    /**
     * Set trực tiếp thông tin profile (dùng sau khi login thành công)
     */
    setProfile: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },

    /**
     * Xóa toàn bộ thông tin profile (dùng khi logout)
     */
    clearProfile: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },

  // --- EXTRA REDUCERS ---
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export các action để dùng trong component
export const { setProfile, clearProfile } = profileSlice.actions;

// Export selectors để lấy dữ liệu từ store
export const selectProfile = (state) => state.profile.data;
export const selectProfileLoading = (state) => state.profile.isLoading;
export const selectProfileError = (state) => state.profile.error;

export default profileSlice.reducer;
