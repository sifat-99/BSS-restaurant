import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetTableListAPI } from "../api/GET";
import { CreateTableAPI } from "../api/POST";
import { UpdateTableAPI } from "../api/PUT";
import { DeleteTableAPI } from "../api/DELETE";

export interface FetchTablesParams {
    token: string;
    page?: number;
    perPage?: number;
    search?: string;
    isLoadMore?: boolean; // Optional flag to indicate if it's a load more action
}

export const fetchTables = createAsyncThunk(
    "table/fetchTables",
    async ({ token, page = 1, perPage = 10, search = "" }: FetchTablesParams, { rejectWithValue }) => {
        try {
            const response = await GetTableListAPI(token, page, perPage, search);

            let data = [];
            let totalCount = 0;
            let lastPage = 1;

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
        } catch (error : any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch tables.");
        }
    }
);

export const fetchOrderTables = createAsyncThunk(
    "table/fetchOrderTables",
    async ({ token, page = 1, perPage = 5, search = "" }: FetchTablesParams, { rejectWithValue }) => {
        try {
            const response = await GetTableListAPI(token, page, perPage, search);

            let data = [];
            let totalCount = 0;
            let lastPage = 1;

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
        } catch (error : any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch order tables.");
        }
    }
);

export const createTable = createAsyncThunk(
    "table/createTable",
    async ({ data, token, page, perPage, search }: { data: any; token: string; page: number; perPage: number; search: string }, { dispatch, rejectWithValue }) => {
        try {
            const response = await CreateTableAPI(data, token);
            dispatch(fetchTables({ token, page, perPage, search })); // Refresh list
            return response.data;
        } catch (error : any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create table.");
        }
    }
);

export const updateTable = createAsyncThunk(
    "table/updateTable",
    async ({ id, data, token, page, perPage, search }: { id: string; data: any; token: string; page: number; perPage: number; search: string }, { dispatch, rejectWithValue }) => {
        try {
            const response = await UpdateTableAPI(id, data, token);
            dispatch(fetchTables({ token, page, perPage, search })); // Refresh list
            return response.data;
        } catch (error : any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update table.");
        }
    }
);

export const deleteTable = createAsyncThunk(
    "table/deleteTable",
    async ({ id, token, page, perPage, search }: { id: string; token: string; page: number; perPage: number; search: string }, { dispatch, rejectWithValue }) => {
        try {
            const response = await DeleteTableAPI(id, token);
            dispatch(fetchTables({ token, page, perPage, search })); // Refresh list
            return response.data;
        } catch (error : any) {
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
        // Separate state for OrderPage tables
        orderTables: [],
        orderTablePage: 1,
        orderTableLastPage: 1,
        orderTableLoading: false,
    },
    reducers: {
        setPagination: (state, action) => {
            if (action.payload.page !== undefined) state.page = action.payload.page;
            if (action.payload.perPage !== undefined) state.perPage = action.payload.perPage;
            if (action.payload.search !== undefined) state.search = action.payload.search;
        }
    },
    extraReducers: (builder : any) => {
        builder
            .addCase(fetchTables.pending, (state : any) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTables.fulfilled, (state : any, action : any) => {
                state.loading = false;
                if (action.meta.arg && action.meta.arg.isLoadMore) {
                    // Filter out duplicates just in case
                    const newTables = action.payload.data.filter(
                        (newTable: any) => !state.tables.some((existing : any) => existing.id === newTable.id)
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
            .addCase(fetchTables.rejected, (state : any, action : any) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch tables";
            })
            .addCase(fetchOrderTables.pending, (state:any) => {
                state.orderTableLoading = true;
            })
            .addCase(fetchOrderTables.fulfilled, (state : any, action : any) => {
                state.orderTableLoading = false;
                if (action.meta.arg && action.meta.arg.isLoadMore) {
                    const newTables = action.payload.data.filter(
                        (newTable: any) => !state.orderTables.some((existing: any) => existing.id === newTable.id)
                    );
                    state.orderTables = [...state.orderTables, ...newTables];
                } else {
                    state.orderTables = action.payload.data;
                }
                state.orderTablePage = action.payload.page;
                state.orderTableLastPage = action.payload.lastPage;
            })
            .addCase(fetchOrderTables.rejected, (state : any, action : any) => {
                state.orderTableLoading = false;
            })
            .addCase(createTable.fulfilled, (state : any, action : any) => {
                const newItem = action.payload?.id ? action.payload : { ...action.meta.arg.data, id: Date.now() };
                state.tables = [...state.tables, newItem];
                state.totalCount += 1;
                // Optionally update orderTables too if it matches
                state.orderTables = [...state.orderTables, newItem];
            })
            .addCase(updateTable.fulfilled, (state : any, action : any) => {
                const { id, data } = action.meta.arg;
                const index = state.tables.findIndex((item: any) => item.id === id);
                if (index !== -1) {
                    state.tables[index] = { ...state.tables[index], ...data };
                }
                const orderIndex = state.orderTables.findIndex((item: any) => item.id === id);
                if (orderIndex !== -1) {
                    state.orderTables[orderIndex] = { ...state.orderTables[orderIndex], ...data };
                }
            })
            .addCase(deleteTable.fulfilled, (state : any, action : any) => {
                const id = action.meta.arg.id;
                state.tables = state.tables.filter((item: any) => item.id !== id);
                state.totalCount -= 1;
                state.orderTables = state.orderTables.filter((item: any) => item.id !== id);
            });
    },
});

export const { setPagination } = tableSlice.actions;

export default tableSlice.reducer;
