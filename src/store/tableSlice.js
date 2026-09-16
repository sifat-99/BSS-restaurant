import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetTableListAPI } from "../api/GET";
import { CreateTableAPI } from "../api/POST";
import { UpdateTableAPI } from "../api/PUT";
import { DeleteTableAPI } from "../api/DELETE";

export const fetchTables = createAsyncThunk(
    "table/fetchTables",
    async ({ token, page = 1, perPage = 10, search = "" }, { rejectWithValue }) => {
        try {
            const response = await GetTableListAPI(token, page, perPage, search);

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
            return rejectWithValue(error.response?.data?.message || "Failed to fetch tables.");
        }
    }
);

export const createTable = createAsyncThunk(
    "table/createTable",
    async ({ data, token, page, perPage, search }, { dispatch, rejectWithValue }) => {
        try {
            const response = await CreateTableAPI(data, token);
            dispatch(fetchTables({ token, page, perPage, search })); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create table.");
        }
    }
);

export const updateTable = createAsyncThunk(
    "table/updateTable",
    async ({ id, data, token, page, perPage, search }, { dispatch, rejectWithValue }) => {
        try {
            const response = await UpdateTableAPI(id, data, token);
            dispatch(fetchTables({ token, page, perPage, search })); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update table.");
        }
    }
);

export const deleteTable = createAsyncThunk(
    "table/deleteTable",
    async ({ id, token, page, perPage, search }, { dispatch, rejectWithValue }) => {
        try {
            const response = await DeleteTableAPI(id, token);
            dispatch(fetchTables({ token, page, perPage, search })); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete table.");
        }
    }
);

const tableSlice = createSlice({
    name: "table",
    initialState: {
        tables: [],
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
            .addCase(fetchTables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTables.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg && action.meta.arg.isLoadMore) {
                    // Filter out duplicates just in case
                    const newTables = action.payload.data.filter(
                        (newTable) => !state.tables.some((existing) => existing.id === newTable.id)
                    );
                    state.tables = [...state.tables, ...newTables];
                } else {
                    state.tables = action.payload.data;
                }
                state.totalCount = action.payload.totalCount;
                state.page = action.payload.page;
                state.perPage = action.payload.perPage;
                state.search = action.payload.search;
                state.lastPage = action.payload.lastPage;
            })
            .addCase(fetchTables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch tables";
            })
            .addCase(createTable.fulfilled, (state, action) => {
                const newItem = action.payload?.id ? action.payload : { ...action.meta.arg.data, id: Date.now() };
                state.tables = [...state.tables, newItem];
                state.totalCount += 1;
            })
            .addCase(updateTable.fulfilled, (state, action) => {
                const { id, data } = action.meta.arg;
                const index = state.tables.findIndex(item => item.id === id);
                if (index !== -1) {
                    state.tables[index] = { ...state.tables[index], ...data };
                }
            })
            .addCase(deleteTable.fulfilled, (state, action) => {
                const id = action.meta.arg.id;
                state.tables = state.tables.filter(item => item.id !== id);
                state.totalCount -= 1;
            });
    },
});

export const { setPagination } = tableSlice.actions;

export default tableSlice.reducer;
