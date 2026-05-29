import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyCVDetail,
  updateMyCVProfile,
  updateMyCVStatus,
  updateCVSkills,
  updateCVEducations,
  updateCVProjects,
  updateCVInterests,
  updateCVCertifications,
  getPublicCV,
} from "@/services/cvProfileService";

// ============================================================
// ASYNC THUNKS
// ============================================================

export const fetchMyCVDetail = createAsyncThunk(
  "cvProfile/fetchMyCVDetail",
  async (_, { rejectWithValue }) => {
    try {
      return await getMyCVDetail();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || "Không thể tải CV",
      );
    }
  },
);

export const saveCVGeneralInfo = createAsyncThunk(
  "cvProfile/saveCVGeneralInfo",
  async (data, { rejectWithValue }) => {
    try {
      return await updateMyCVProfile(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || "Lưu thông tin thất bại",
      );
    }
  },
);

export const saveCVStatus = createAsyncThunk(
  "cvProfile/saveCVStatus",
  async (data, { rejectWithValue }) => {
    try {
      return await updateMyCVStatus(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || "Cập nhật trạng thái thất bại",
      );
    }
  },
);

export const saveSkills = createAsyncThunk(
  "cvProfile/saveSkills",
  async (skills, { rejectWithValue }) => {
    try {
      await updateCVSkills(skills);
      return skills;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || "Lưu kỹ năng thất bại",
      );
    }
  },
);

export const saveEducations = createAsyncThunk(
  "cvProfile/saveEducations",
  async (educations, { rejectWithValue }) => {
    try {
      await updateCVEducations(educations);
      return educations;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || "Lưu học vấn thất bại",
      );
    }
  },
);

export const saveProjects = createAsyncThunk(
  "cvProfile/saveProjects",
  async (projects, { rejectWithValue }) => {
    try {
      await updateCVProjects(projects);
      return projects;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || "Lưu dự án thất bại",
      );
    }
  },
);

export const saveInterests = createAsyncThunk(
  "cvProfile/saveInterests",
  async (interests, { rejectWithValue }) => {
    try {
      await updateCVInterests(interests);
      return interests;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || "Lưu sở thích thất bại",
      );
    }
  },
);

export const saveCertifications = createAsyncThunk(
  "cvProfile/saveCertifications",
  async (certifications, { rejectWithValue }) => {
    try {
      await updateCVCertifications(certifications);
      return certifications;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || "Lưu chứng chỉ thất bại",
      );
    }
  },
);

export const fetchPublicCV = createAsyncThunk(
  "cvProfile/fetchPublicCV",
  async (username, { rejectWithValue }) => {
    try {
      return await getPublicCV(username);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || "Không tìm thấy CV",
      );
    }
  },
);

// ============================================================
// INITIAL STATE
// ============================================================
const initialState = {
  myDetail: null, // CvProfileDetailDTO — toàn bộ CV của user login
  publicCV: null, // CV public (xem preview)
  isLoading: false, // loading khi fetch
  isSaving: false, // loading khi save bất kỳ section nào
  savingSection: null, // tên section đang save: "skills"|"projects"|...
  lastSaved: null, // ISO timestamp lần save cuối
  error: null,
};

// ============================================================
// SLICE
// ============================================================
const cvProfileSlice = createSlice({
  name: "cvProfile",
  initialState,
  reducers: {
    clearCVProfile: (state) => {
      state.myDetail = null;
      state.publicCV = null;
      state.error = null;
      state.lastSaved = null;
    },
    /** Cập nhật trực tiếp một section trong myDetail (optimistic update) */
    patchCVSection: (state, action) => {
      const { section, data } = action.payload;
      if (state.myDetail) {
        state.myDetail[section] = data;
      }
    },
  },
  extraReducers: (builder) => {
    // --- fetchMyCVDetail ---
    builder
      .addCase(fetchMyCVDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyCVDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myDetail = action.payload;
      })
      .addCase(fetchMyCVDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // --- fetchPublicCV ---
    builder
      .addCase(fetchPublicCV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicCV = action.payload;
      })
      .addCase(fetchPublicCV.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // --- saveCVGeneralInfo ---
    builder
      .addCase(saveCVGeneralInfo.pending, (state) => {
        state.isSaving = true;
        state.savingSection = "general";
      })
      .addCase(saveCVGeneralInfo.fulfilled, (state, action) => {
        state.isSaving = false;
        state.savingSection = null;
        state.lastSaved = new Date().toISOString();
        // Merge updated general info vào myDetail
        if (state.myDetail && action.payload) {
          state.myDetail = { ...state.myDetail, ...action.payload };
        }
      })
      .addCase(saveCVGeneralInfo.rejected, (state, action) => {
        state.isSaving = false;
        state.savingSection = null;
        state.error = action.payload;
      });

    // --- saveCVStatus ---
    builder
      .addCase(saveCVStatus.pending, (state) => {
        state.isSaving = true;
        state.savingSection = "status";
      })
      .addCase(saveCVStatus.fulfilled, (state, action) => {
        state.isSaving = false;
        state.savingSection = null;
        state.lastSaved = new Date().toISOString();
        if (state.myDetail && action.payload) {
          state.myDetail = { ...state.myDetail, ...action.payload };
        }
      })
      .addCase(saveCVStatus.rejected, (state, action) => {
        state.isSaving = false;
        state.savingSection = null;
        state.error = action.payload;
      });

    // Helper: tạo các section save cases (skills, educations, ...)
    const addSectionSaveCases = (thunk, sectionKey) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.isSaving = true;
          state.savingSection = sectionKey;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.isSaving = false;
          state.savingSection = null;
          state.lastSaved = new Date().toISOString();
          if (state.myDetail) {
            state.myDetail[sectionKey] = action.payload;
          }
        })
        .addCase(thunk.rejected, (state, action) => {
          state.isSaving = false;
          state.savingSection = null;
          state.error = action.payload;
        });
    };

    addSectionSaveCases(saveSkills, "skills");
    addSectionSaveCases(saveEducations, "educations");
    addSectionSaveCases(saveProjects, "projects");
    addSectionSaveCases(saveInterests, "interests");
    addSectionSaveCases(saveCertifications, "certifications");
  },
});

export const { clearCVProfile, patchCVSection } = cvProfileSlice.actions;

// ============================================================
// SELECTORS
// ============================================================
export const selectMyCVDetail = (state) => state.cvProfile.myDetail;
export const selectPublicCV = (state) => state.cvProfile.publicCV;
export const selectCVLoading = (state) => state.cvProfile.isLoading;
export const selectCVSaving = (state) => state.cvProfile.isSaving;
export const selectCVSavingSection = (state) => state.cvProfile.savingSection;
export const selectCVLastSaved = (state) => state.cvProfile.lastSaved;
export const selectCVError = (state) => state.cvProfile.error;

export default cvProfileSlice.reducer;
