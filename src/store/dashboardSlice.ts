import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetDashboardStatsAPI } from '../api/GET';


interface FetchDashboardStatsParams {
  token: string;
  month: number;
  year: number;
}

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async ({ token, month, year }: FetchDashboardStatsParams, { rejectWithValue }) => {
    try {
      const response = await GetDashboardStatsAPI({ token, month, year });
      return response.data;
    } catch (error : any) {
      return rejectWithValue(error.response?.data || 'Failed to load dashboard statistics.');
    }
  }
);

const currentDate = new Date();

interface DashboardState {
  stats: unknown;
  loading: boolean;
  error: unknown;
  month: number;
  year: number;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
  month: currentDate.getMonth() + 1,
  year: currentDate.getFullYear(),
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setMonth: (state, action) => {
      state.month = action.payload;
    },
    setYear: (state, action) => {
      state.year = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch dashboard stats' ;
      });
  },
});

export const { setMonth, setYear } = dashboardSlice.actions;
export default dashboardSlice.reducer;
