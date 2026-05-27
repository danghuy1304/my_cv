import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyProfile, updateProfile } from "@/services/profileService";

// ============================================================
// ASYNC THUNKS - Các action bất đồng bộ gọi API
// ============================================================

/**
 * Fetch thông tin profile từ API
 * createAsyncThunk tự động tạo 3 action: pending, fulfilled, rejected
 */
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile", // Tên action (dùng cho Redux DevTools)
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyProfile();
      return response.data; // Trả về data để lưu vào state
    } catch (error) {
      // rejectWithValue giúp truyền thông tin lỗi vào rejected case
      return rejectWithValue(
        error.response?.data?.message || "Lấy thông tin thất bại",
      );
    }
  },
);

/**
 * Cập nhật thông tin profile qua API
 */
export const saveProfile = createAsyncThunk(
  "profile/saveProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Cập nhật thất bại",
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

  // --- EXTRA REDUCERS: Xử lý trạng thái của Async Thunks ---
  extraReducers: (builder) => {
    // === Xử lý fetchProfile ===
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Lưu data trả về vào state
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Lưu thông báo lỗi vào state
      });

    // === Xử lý saveProfile ===
    builder
      .addCase(saveProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Cập nhật lại data sau khi save thành công
      })
      .addCase(saveProfile.rejected, (state, action) => {
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
