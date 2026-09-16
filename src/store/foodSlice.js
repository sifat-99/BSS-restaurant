import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetFoodListApi } from "../api/GET";
import { CreateFoodAPI } from "../api/POST";
import { UpdateFoodAPI } from "../api/PUT";
import { DeleteFoodAPI } from "../api/DELETE";

export const fetchFoods = createAsyncThunk(
    "food/fetchFoods",
    async ({ token, page = 1, perPage = 10, search = "" }, { rejectWithValue }) => {
        try {
            const response = await GetFoodListApi(token, page, perPage, search);

            let data = [];
            let totalCount = 0;
            let lastPage = 1;

            // Ensure we parse correctly based on the JSON response format
            if (response.data && Array.isArray(response.data.data)) {
                data = response.data.data;
                totalCount = response.data.total || data.length;
                lastPage = response.data.last_page || 1;
            } else if (response.data && Array.isArray(response.data)) {
                data = response.data;
                totalCount = data.length;
            } else if (Array.isArray(response)) {
                data = response;
                totalCount = data.length;
            }

            return { data, totalCount, page, perPage, search, lastPage };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch foods.");
        }
    }
);

export const createFood = createAsyncThunk(
    "food/createFood",
    async ({ data, token, page, perPage, search }, { dispatch, rejectWithValue }) => {
        try {
            const response = await CreateFoodAPI(data, token);
            dispatch(fetchFoods({ token, page, perPage, search })); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create food.");
        }
    }
);

export const updateFood = createAsyncThunk(
    "food/updateFood",
    async ({ id, data, token, page, perPage, search }, { dispatch, rejectWithValue }) => {
        try {
            const response = await UpdateFoodAPI(id, data, token);
            dispatch(fetchFoods({ token, page, perPage, search })); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update food.");
        }
    }
);

export const deleteFood = createAsyncThunk(
    "food/deleteFood",
    async ({ id, token, page, perPage, search }, { dispatch, rejectWithValue }) => {
        try {
            const response = await DeleteFoodAPI(id, token);
            dispatch(fetchFoods({ token, page, perPage, search })); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete food.");
        }
    }
);

const foodSlice = createSlice({
    name: "food",
    initialState: {
        foods: [],
        totalCount: 0,
        page: 1,
        perPage: 10,
        search: "",
        lastPage: 1,
        loading: false,
        error: null,
    },
    reducers: {
        setPagination: (state, action) => {
            if (action.payload.page !== undefined) state.page = action.payload.page;
            if (action.payload.perPage !== undefined) state.perPage = action.payload.perPage;
            if (action.payload.search !== undefined) state.search = action.payload.search;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFoods.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFoods.fulfilled, (state, action) => {
                state.loading = false;
                state.foods = action.payload.data;
                state.totalCount = action.payload.totalCount;
                state.page = action.payload.page;
                state.perPage = action.payload.perPage;
                state.search = action.payload.search;
                state.lastPage = action.payload.lastPage;
            })
            .addCase(fetchFoods.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch foods";
            })
            .addCase(createFood.fulfilled, (state, action) => {
                const newItem = action.payload?.id ? action.payload : { ...action.meta.arg.data, id: Date.now() };
                state.foods = [...state.foods, newItem];
                state.totalCount += 1;
            })
            .addCase(updateFood.fulfilled, (state, action) => {
                const { id, data } = action.meta.arg;
                const index = state.foods.findIndex(item => item.id === id);
                if (index !== -1) {
                    state.foods[index] = { ...state.foods[index], ...data };
                }
            })
            .addCase(deleteFood.fulfilled, (state, action) => {
                const id = action.meta.arg.id;
                state.foods = state.foods.filter(item => item.id !== id);
                state.totalCount -= 1;
            });
    },
});

export const { setPagination } = foodSlice.actions;

export default foodSlice.reducer;
