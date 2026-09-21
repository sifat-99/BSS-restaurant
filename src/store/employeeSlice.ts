import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetEmployeeDatatableAPI } from "../api/GET";
import { CreateEmployeeAPI } from "../api/POST";
import { UpdateEmployeeAPI } from "../api/PUT";
import { DeleteEmployeeAPI } from "../api/DELETE";
import { FetchTablesParams } from "./tableSlice";

export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async ({ token, page = 1, perPage = 10, search = "" }: FetchTablesParams, { rejectWithValue }) => {
    try {
      const response = await GetEmployeeDatatableAPI(token, page, perPage, search);

      let data = [];
      let totalCount = 0;

      if (response.data && Array.isArray(response.data)) {
        data = response.data;
        totalCount = data.length;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        data = response.data.data;
        totalCount = response.data.totalCount || response.data.totalRecords || response.data.total || data.length;
      } else if (Array.isArray(response)) {
        data = response;
        totalCount = data.length;
      }

      return { data, totalCount, page, perPage, search };
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch employees.");
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async ({ data, token, page, perPage, search }: { data: any; token: string; page: number; perPage: number; search: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await CreateEmployeeAPI(data, token);
      dispatch(fetchEmployees({ token, page, perPage, search })); // Refresh list
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create employee.");
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async ({ id, data, token, page, perPage, search }: { id: string; data: any; token: string; page: number; perPage: number; search: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await UpdateEmployeeAPI(id, data, token);
      dispatch(fetchEmployees({ token, page, perPage, search })); // Refresh list
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update employee.");
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async ({ id, token, page, perPage, search }: { id: string; token: string; page: number; perPage: number; search: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await DeleteEmployeeAPI(id, token);
      dispatch(fetchEmployees({ token, page, perPage, search })); // Refresh list
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete employee.");
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    totalCount: 0,
    page: 1,
    perPage: 10,
    search: "",
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
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data;
        state.totalCount = action.payload.totalCount;
        state.page = action.payload.page;
        state.perPage = action.payload.perPage;
        state.search = action.payload.search;
      })
      .addCase(fetchEmployees.rejected, (state : any, action : any) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch employees";
      })
      .addCase(createEmployee.fulfilled, (state : any, action : any) => {
        const newItem = action.payload?.id ? action.payload : { ...action.meta.arg.data, id: Date.now() };
        state.employees = [...state.employees, newItem];
        state.totalCount += 1;
      })
      .addCase(updateEmployee.fulfilled, (state : any, action : any) => {
        const { id, data } = action.meta.arg;
        const index = state.employees.findIndex((item:any) => item.id === id);
        if (index !== -1) {
          state.employees[index] = { ...state.employees[index], ...data };
        }
      })
      .addCase(deleteEmployee.fulfilled, (state : any, action : any) => {
        const id = action.meta.arg.id;
        state.employees = state.employees.filter((item:any) => item.id !== id);
        state.totalCount -= 1;
      });
  },
});

export const { setPagination } = employeeSlice.actions;

export default employeeSlice.reducer;
